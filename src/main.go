package main

import (
	"fmt"
	"html/template"
	"log"
	"math"
	"net/http"
	"regexp"
	"sort"
	"strconv"
	"time"
)

type PostId struct {
	PostId uint32
}

type ReplyData struct {
	LinkTo       PostId
	LinkToThread PostId
}

type PostContent struct {
	Text         []byte
	LinkTo       PostId
	LinkToThread PostId
}

type Post struct {
	Id      PostId
	Thread  PostId
	Title   string
	Date    time.Time
	Content []PostContent
}

type PostView struct {
	Id      PostId
	Thread  PostId
	Title   string
	Date    time.Time
	Content []PostContent
	Replies []ReplyData
}

type ReplyLink struct {
	target PostId
	reply  PostId
}

type Database struct {
	UniqueId uint32
	Posts    []Post
	Threads  []PostId
	Replies  []ReplyLink
}

type ThreadPreview struct {
	MainPost     PostView
	Posts        []PostView
	LastPostTime time.Time
}

type ForumView struct {
	Threads      []ThreadPreview
	ThreadsCount int
	PostsCount   int
	CurrentTime  string
	LastPostTime string
	DB           *Database
}

type ThreadView struct {
	MainPost PostView
	Thread   []PostView
	DB       *Database
}

func (d *Database) newId() PostId {
	var new_id = PostId{d.UniqueId}
	d.UniqueId++
	return new_id
}

var reply_string = []byte(">>")
var space = []byte(" ")

type ReplyMark struct {
	start int
	end   int
	post  PostId
}

var emptyTemplate = template.HTML("")

var invalidId = PostId{math.MaxUint32}

func transformBody(body []byte, id PostId, d *Database) []PostContent {
	replies := make([]ReplyMark, 0)

	// we are looking for reply string
	// and parse the numbers after it
	// if we are able to parse them into valid post,
	// then replace it with a link

	repliesSet := make(map[PostId]bool)

	for i := 0; i < len(body); i++ {
		// print(i)

		replyCandidateFound := true
		for j := 0; j < len(reply_string); j++ {
			// print(j)

			if i+j >= len(body) {
				// print("too long")
				replyCandidateFound = false
				break
			}

			if body[i+j] != reply_string[j] {
				// print("wrong symbol")
				replyCandidateFound = false
			}
		}

		// print(replyCandidateFound)

		if replyCandidateFound {
			number := body[i+len(reply_string) : min(len(body), i+len(reply_string)+20)]

			result := -1

			distance := 0

			for j := 0; j < len(number); j++ {
				if '0' <= number[j] && number[j] <= '9' {
					if result == -1 {
						result = 0
					}
					result = result*10 + int(number[j]) - '0'
					distance = j
				} else {
					break
				}
			}

			if result != -1 {
				potentialId := uint32(result)

				if d.UniqueId > potentialId+1 {

					if repliesSet[PostId{potentialId}] == false {
						d.Replies = append(d.Replies, ReplyLink{PostId{potentialId}, id})
					}

					repliesSet[PostId{potentialId}] = true
					mark := ReplyMark{i, i + distance + len(reply_string), PostId{potentialId}}
					replies = append(replies, mark)
				}
			}
		}
	}

	result_body := make([]PostContent, 0)

	if len(replies) == 0 {
		result_body = append(result_body, PostContent{body, invalidId, invalidId})
	} else {
		copyFrom := 0
		copyUntil := 0

		for i := 0; i < len(replies); i++ {
			copyUntil = replies[i].start
			result_body = append(result_body, PostContent{body[copyFrom:copyUntil], invalidId, invalidId})

			thread := d.Posts[replies[i].post.PostId].Thread
			result_body = append(result_body, PostContent{make([]byte, 0), replies[i].post, thread})
			copyFrom = replies[i].end + 1
		}

		result_body = append(result_body, PostContent{body[copyFrom:], invalidId, invalidId})
	}

	return result_body
}

func (d *Database) newPost(thread PostId, title string, body []byte) PostId {
	// validate that post is a thread
	var threadOpPost = d.Posts[thread.PostId]
	if threadOpPost.Thread != thread {
		return thread
	}
	id := d.newId()
	var post = Post{id, thread, title, time.Now(), transformBody(body, id, d)}
	d.Posts = append(d.Posts, post)

	return post.Id
}

func (d *Database) newThread(title string, body []byte) PostId {
	var new_id = d.newId()
	var post = Post{new_id, new_id, title, time.Now(), transformBody(body, new_id, d)}
	d.Posts = append(d.Posts, post)
	d.Threads = append(d.Threads, post.Id)
	return new_id
}

func createDatabase() Database {
	var d Database
	d.UniqueId = 0
	d.Posts = make([]Post, 0)
	return d
}

func generatePosts(d *Database) {
	d.newThread("aaaaa1", []byte("a"))
	// d.newPost(thread1, "aaaaa2", []byte("bbbbb2"))
	// d.newPost(thread1, "aaaaa3", []byte("bbbbb3"))
	// d.newPost(thread1, "aaaaa4", []byte("bbbbb4"))

	// d.newThread("aaaaa13", []byte("bbbbb13"))
	// d.newThread("aaaaa13", []byte("bbbbb31"))

	d.newThread("aaaaa13", []byte(">>0"))
}

func handleCreatePost(d *Database, w http.ResponseWriter, r *http.Request, thread PostId) {
	d.newPost(
		thread,
		r.FormValue("title"),
		[]byte(r.FormValue("body")),
	)

	http.Redirect(w, r, "/thread/"+strconv.Itoa(int(thread.PostId)), http.StatusFound)
}

func handleViewThread(d *Database, w http.ResponseWriter, r *http.Request, thread PostId) {
	{
		css, _ := template.ParseFiles("templates/cssjs.html")
		css.Execute(w, 0)
	}

	t, error := template.ParseFiles(
		"templates/post_link.html",
		"templates/main_post.html",
		"templates/post.html",
		"templates/create_post.html",
		"templates/thread.html",
	)

	if error != nil {
		fmt.Print(error)
	}

	var th ThreadView

	th.DB = d

	th.Thread = make([]PostView, 0)

	for i := 0; i < len(d.Posts); i++ {
		var post = th.DB.Posts[i]
		if post.Thread == thread {
			postView := PostView{
				post.Id, post.Thread, post.Title, post.Date, post.Content, make([]ReplyData, 0),
			}
			th.Thread = append(th.Thread, postView)
		}
	}

	repliesTo := make(map[PostId][]ReplyData)

	for i := 0; i < len(d.Replies); i++ {
		var reply = d.Replies[i]
		var replyThread = d.Posts[reply.reply.PostId].Thread
		replyData := ReplyData{reply.reply, replyThread}
		repliesTo[reply.target] = append(repliesTo[reply.target], replyData)
	}

	for i := 0; i < len(th.Thread); i++ {
		th.Thread[i].Replies = append(th.Thread[i].Replies, repliesTo[th.Thread[i].Id]...)
	}

	th.MainPost = th.Thread[0]
	th.Thread = th.Thread[1:]

	t.ExecuteTemplate(w, "THREAD", th)
}

func handleCreateThread(d *Database, w http.ResponseWriter, r *http.Request) {
	d.newThread(
		r.FormValue("title"),
		[]byte(r.FormValue("body")),
	)

	http.Redirect(w, r, "/forum/", http.StatusFound)
}

func handleViewForum(d *Database, w http.ResponseWriter, r *http.Request) {
	{
		css, error := template.ParseFiles("templates/cssjs.html")
		css.Execute(w, 0)

		if error != nil {
			fmt.Print(error)
		}
	}

	t, error := template.ParseFiles(
		"templates/post_link.html",
		"templates/main_post.html",
		"templates/post.html",
		"templates/create_thread.html",
		"templates/forum.html",
	)

	if error != nil {
		fmt.Print(error)
	}

	repliesTo := make(map[PostId][]ReplyData)

	for i := 0; i < len(d.Replies); i++ {
		var reply = d.Replies[i]
		var replyThread = d.Posts[reply.reply.PostId].Thread
		replyData := ReplyData{reply.reply, replyThread}
		repliesTo[reply.target] = append(repliesTo[reply.target], replyData)
	}

	print("\n")
	fmt.Print(repliesTo)

	var f ForumView
	f.DB = d
	f.ThreadsCount = len(d.Threads)
	f.PostsCount = len(d.Posts)
	f.CurrentTime = time.Now().Format("2006-01-02 15:04:05")

	var postToIndex map[uint32]uint32 = make(map[uint32]uint32)

	for i := len(d.Threads) - 1; i >= 0; i-- {
		var preview ThreadPreview

		post := d.Posts[d.Threads[i].PostId]
		preview.MainPost = PostView{
			post.Id, post.Thread, post.Title, post.Date, post.Content, make([]ReplyData, 0),
		}

		preview.LastPostTime = post.Date

		preview.MainPost.Replies = append(preview.MainPost.Replies, repliesTo[preview.MainPost.Id]...)

		postToIndex[d.Threads[i].PostId] = uint32(len(d.Threads) - 1 - i)
		f.Threads = append(f.Threads, preview)
	}

	var lastPostTime = time.Unix(0, 0)

	for i := 0; i < len(d.Posts); i++ {
		var threadPostId = d.Posts[i].Thread
		var index = postToIndex[threadPostId.PostId]

		if lastPostTime.Before(d.Posts[i].Date) {
			lastPostTime = d.Posts[i].Date
		}

		if f.Threads[index].MainPost.Id == d.Posts[i].Id {
			continue
		}

		post := d.Posts[i]

		if post.Date.After(f.Threads[index].LastPostTime) {
			f.Threads[index].LastPostTime = post.Date
		}

		f.Threads[index].Posts = append(f.Threads[index].Posts, PostView{
			post.Id, post.Thread, post.Title, post.Date, post.Content, make([]ReplyData, 0),
		})
		if len(f.Threads[index].Posts) > 3 {
			f.Threads[index].Posts = f.Threads[index].Posts[1:]
		}
	}

	for i := 0; i < len(f.Threads); i++ {
		for j := 0; j < len(f.Threads[i].Posts); j++ {
			f.Threads[i].Posts[j].Replies = append(f.Threads[i].Posts[j].Replies, repliesTo[f.Threads[i].Posts[j].Id]...)
		}
	}

	sort.Slice(f.Threads, func(i, j int) bool {
		return f.Threads[i].LastPostTime.After(f.Threads[j].LastPostTime)
	})

	f.LastPostTime = lastPostTime.Format("2006-01-02 15:04:05")

	t.ExecuteTemplate(w, "FORUM", f)
}

var validPath = regexp.MustCompile("^/(thread|forum|create_post|create_thread)/([a-zA-Z0-9]+)$")

func main() {
	var d = createDatabase()

	generatePosts(&d)

	// http.HandleFunc("/create_post", createPost)
	http.HandleFunc("/forum/", func(w http.ResponseWriter, r *http.Request) { handleViewForum(&d, w, r) })
	http.HandleFunc("/thread/", func(w http.ResponseWriter, r *http.Request) {
		m := validPath.FindStringSubmatch(r.URL.Path)
		if m == nil {
			http.NotFound(w, r)
			return
		}
		raw_id, error := strconv.Atoi(m[2])
		if error != nil {
			fmt.Print(error)
		}
		handleViewThread(&d, w, r, PostId{uint32(raw_id)})
	})
	http.HandleFunc("/create_thread/", func(w http.ResponseWriter, r *http.Request) { handleCreateThread(&d, w, r) })
	http.HandleFunc("/create_post/", func(w http.ResponseWriter, r *http.Request) {
		m := validPath.FindStringSubmatch(r.URL.Path)
		if m == nil {
			http.NotFound(w, r)
			return
		}
		raw_id, error := strconv.Atoi(m[2])
		if error != nil {
			fmt.Print(error)
		}
		handleCreatePost(&d, w, r, PostId{uint32(raw_id)})
	})
	http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("css"))))
	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("js"))))

	log.Fatal(http.ListenAndServe(":8080", nil))
}
