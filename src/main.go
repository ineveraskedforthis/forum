package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"regexp"
	"strconv"
	"time"
)

type PostId struct {
	PostId uint32
}

type Post struct {
	Id      PostId
	Thread  PostId
	Title   string
	Date    time.Time
	Content []byte
}

type Database struct {
	UniqueId uint32
	Posts    []Post
	Threads  []PostId
}

type ThreadPreview struct {
	MainPost PostId
	Posts    []PostId
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
	Thread []PostId
	DB     *Database
}

func (d *Database) newId() PostId {
	var new_id = PostId{d.UniqueId}
	d.UniqueId++
	return new_id
}

func (d *Database) newPost(thread PostId, title string, body []byte) PostId {
	var post = Post{d.newId(), thread, title, time.Now(), body}
	d.Posts = append(d.Posts, post)
	fmt.Print(post.Id)
	print("\n")
	return post.Id
}

func (d *Database) newThread(title string, body []byte) PostId {
	var new_id = d.newId()
	var post = Post{new_id, new_id, title, time.Now(), body}
	d.Posts = append(d.Posts, post)
	d.Threads = append(d.Threads, post.Id)
	fmt.Print(post.Id)
	print("\n")
	return new_id
}

func createDatabase() Database {
	var d Database
	d.UniqueId = 0
	d.Posts = make([]Post, 0)
	return d
}

func generatePosts(d *Database) {
	var thread1 = d.newThread("aaaaa1", []byte("bbbbb1"))
	d.newPost(thread1, "aaaaa2", []byte("bbbbb2"))
	d.newPost(thread1, "aaaaa3", []byte("bbbbb3"))
	d.newPost(thread1, "aaaaa4", []byte("bbbbb4"))

	d.newThread("aaaaa13", []byte("bbbbb13"))
	d.newThread("aaaaa13", []byte("bbbbb31"))
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
	fmt.Print("request view\n")

	{
		css, _ := template.ParseFiles("templates/cssjs.html")
		css.Execute(w, 0)
	}

	t, error := template.ParseFiles(
		"templates/post.html",
		"templates/create_post.html",
		"templates/thread.html",
	)

	fmt.Print(error)

	var th ThreadView

	th.DB = d

	for i := 0; i < len(d.Posts); i++ {
		var post = th.DB.Posts[i]
		if post.Thread == thread {
			th.Thread = append(th.Thread, post.Id)
		}
	}

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
	fmt.Print("request view\n")

	{
		css, error := template.ParseFiles("templates/cssjs.html")
		css.Execute(w, 0)

		fmt.Print(error)
	}

	t, error := template.ParseFiles(
		"templates/post.html",
		"templates/create_thread.html",
		"templates/forum.html",
	)

	fmt.Print(error)

	var f ForumView
	f.DB = d
	f.ThreadsCount = len(d.Threads)
	f.PostsCount = len(d.Posts)
	f.CurrentTime = time.Now().Format("2006-01-02 15:04:05")

	var postToIndex map[uint32]uint32 = make(map[uint32]uint32)

	for i := len(d.Threads) - 1; i >= 0; i-- {
		var preview ThreadPreview
		preview.MainPost = d.Threads[i]
		postToIndex[d.Threads[i].PostId] = uint32(len(d.Threads) - 1 - i)
		f.Threads = append(f.Threads, preview)
	}

	fmt.Print(postToIndex)

	var lastPostTime = time.Unix(0, 0)

	for i := 0; i < len(d.Posts); i++ {
		var threadPostId = d.Posts[i].Thread
		var index = postToIndex[threadPostId.PostId]

		if lastPostTime.Before(d.Posts[i].Date) {
			lastPostTime = d.Posts[i].Date
		}

		if f.Threads[index].MainPost == d.Posts[i].Id {
			continue
		}

		if len(f.Threads[index].Posts) > 3 {
			continue
		}

		f.Threads[index].Posts = append(f.Threads[index].Posts, d.Posts[i].Id)
	}

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
		fmt.Print(error)
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
		fmt.Print(error)
		print(raw_id)
		handleCreatePost(&d, w, r, PostId{uint32(raw_id)})
	})
	http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("css"))))
	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("js"))))

	log.Fatal(http.ListenAndServe(":8080", nil))
}
