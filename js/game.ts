const new_div = () => {return document.createElement("div")}
const new_label = (label: string) => {let d = document.createElement("div"); d.innerHTML = label; return d}
namespace commodity {
    export const coins = 0
    export const fluids = 1
    export const blood = 2
    export const water = 3
    export const weapons = 4
    export const enchanted_weapons = 5
    export const magic_crystals = 6
    export const ore = 7
    export const ingot = 8
    export const coal = 9
    export const anvil = 10
    export const pickaxe = 11
    export const shovel = 12
    export const magic_tools = 13
    export const bricks = 14
    export const clay = 15
    export const total = 16
}

interface commodity_data {
    name: string,
    base_spendings: number,
    base_production: number
}

const commodity_definition: commodity_data[] = []
commodity_definition[commodity.coins] = {
    name: "Coins",
    base_spendings: 0,
    base_production: 0
}
commodity_definition[commodity.fluids] = {
    name: "Fluids",
    base_spendings: 1000,
    base_production: 5
}
commodity_definition[commodity.blood] = {
    name: "Blood",
    base_spendings: 1000,
    base_production: 10
}
commodity_definition[commodity.water] = {
    name: "Water",
    base_spendings: 10,
    base_production: 100
}
commodity_definition[commodity.weapons] = {
    name: "Weapons",
    base_spendings: 5000,
    base_production: 1000
}
commodity_definition[commodity.enchanted_weapons] = {
    name: "Enchanted Weapons",
    base_spendings: 10000,
    base_production: 100
}
commodity_definition[commodity.magic_crystals] = {
    name: "Magic crystals",
    base_spendings: 1000,
    base_production: 10
}
commodity_definition[commodity.ore] = {
    name: "Ore",
    base_spendings: 20000,
    base_production: 10000
}
commodity_definition[commodity.ingot] = {
    name: "Ingots",
    base_spendings: 20000,
    base_production: 1000
}
commodity_definition[commodity.coal] = {
    name: "Coal",
    base_spendings: 20000,
    base_production: 10000
}
commodity_definition[commodity.anvil] = {
    name: "Anvil",
    base_spendings: 2200,
    base_production: 100
}
commodity_definition[commodity.pickaxe] = {
    name: "Pickaxe",
    base_spendings: 2000,
    base_production: 100
}
commodity_definition[commodity.shovel] = {
    name: "Shovel",
    base_spendings: 2000,
    base_production: 100
}
commodity_definition[commodity.magic_tools] = {
    name: "Magic Tools",
    base_spendings: 1000000,
    base_production: 10
}
commodity_definition[commodity.bricks] = {
    name: "Bricks",
    base_spendings: 10000,
    base_production: 1000
}
commodity_definition[commodity.clay] = {
    name: "Clay",
    base_spendings: 10000,
    base_production: 1000
}

const inventory: number[] = [];
const trade: number[] = []

const price: number[] = []
const local_supply: number[] = []
const local_demand: number[] = []

inventory.length = commodity.total;
trade.length = commodity.total
price.length = commodity.total
local_supply.length = commodity.total
local_demand.length = commodity.total

inventory.fill(0, 0, commodity.total);
trade.fill(0, 0, commodity.total);
price.fill(100, 0, commodity.total);

price[commodity.coins] = 1

inventory[commodity.magic_crystals] = 2000

function trade_change(i: number, x: number) {
    return () => trade[i] += x
}

function init_inventory_frame() {
    let frame = document.getElementById("inventory-frame")
    if (frame == undefined) {
        alert("No inventory frame")
        return;
    }
    frame.innerHTML = ""
    for (let i = 0; i < commodity.total; i++) {
        let item = document.createElement("div");
        item.classList.add("row")

        let label = document.createElement("div")
        label.innerHTML = commodity_definition[i].name

        let have = document.createElement("div")
        have.id = "inv" + i
        have.innerHTML = "Have: " + inventory[i]

        let trade_div = document.createElement("div")
        trade_div.id = "trade" + i
        trade_div.innerHTML = "Trade: " + trade[i]

        let button_increase_trade = document.createElement("div");
        button_increase_trade.classList.add("button")
        button_increase_trade.innerHTML = "Buy more";
        button_increase_trade.onclick = trade_change(i, 1)

        let button_decrease_trade = document.createElement("div");
        button_decrease_trade.classList.add("button")
        button_decrease_trade.innerHTML = "Sell more";
        button_decrease_trade.onclick = trade_change(i, -1)

        let price_div = document.createElement("div")
        price_div.id = "price" + i
        price_div.innerHTML = "Price: " + price[i]

        frame.appendChild(item)
        item.appendChild(label)
        item.appendChild(have)
        item.appendChild(button_increase_trade)
        item.appendChild(trade_div)
        item.appendChild(button_decrease_trade)
        item.appendChild(price_div)
    }
}

function update_inventory_frame() {
    for (let i = 0; i < commodity.total; i++) {
        let have = document.getElementById("inv" + i)!
        have.innerHTML = "Have: " + inventory[i]

        let trade_div = document.getElementById("trade" + i)!
        trade_div.innerHTML = "Trade: " + trade[i]

        let price_div = document.getElementById("price" + i)!
        price_div.innerHTML = "Price: " + price[i]
    }
}

interface commodity_box {
    commodity: number
    amount: number
}

function div_commodity_set(label: string, set: commodity_box[]) {
    let frame = new_div()
    let label_div = new_div()
    label_div.innerHTML = label
    frame.appendChild(label_div)

    for (let item of set) {
        let item_div = new_div()
        item_div.classList.add("row")

        let name_div = new_div()
        let count_div = new_div()

        name_div.innerHTML = commodity_definition[item.commodity].name
        count_div.innerHTML = item.amount.toString()

        item_div.appendChild(name_div)
        item_div.appendChild(count_div)

        frame.appendChild(item_div)
    }

    return frame
}

namespace skills {
    export const mining = 0
    export const enchanting = 1
    export const smelting = 2
    export const smith = 3
    export const magesmith = 4
    export const movement = 5
    export const total = 6
}

const skill_names = {}
skill_names[skills.mining] = "mining"
skill_names[skills.enchanting] = "enchanting"
skill_names[skills.smelting] = "smelting"
skill_names[skills.smith] = "smith"
skill_names[skills.magesmith] = "magesmith"

function base_skill () {
    let result: number[] = []
    result.length = skills.total;
    result.fill(0, 0, skills.total)

    return result
}

interface building_definition {
    name: string
    inputs: commodity_box[]
    tools: commodity_box[]
    outputs: commodity_box[]
    cost: commodity_box[]
    strength_multiplier: number
    vitality_multiplier: number
    magic_multiplier: number

    skill: number
}

interface character {
    id: number,
    name: string,
    portrait: string,
    strength: number
    vitality: number
    magic: number
    trust: number
    desired_wage: number
    rarity: number

    skills: number[]
}

const player: character = {
    id: 0,
    name: "(You)",
    portrait: "../images/player.png",
    strength: 1,
    vitality: 0,
    magic: 1,
    trust: 100,
    desired_wage: 0,
    rarity: 0,

    skills: base_skill()
}

const imp: character = {
    id: 1,
    name: "Large Imp",
    portrait: "../images/imp.png",
    strength: 2,
    vitality: 2,
    magic: 1,
    trust: 0,
    desired_wage: 1,
    rarity: 10,

    skills: base_skill()
}
imp.skills[skills.mining] = 20

const minor_imp: character = {
    id: 2,
    name: "Minor Horned Imp",
    portrait: "../images/imp_small_horned.png",
    strength: 1,
    vitality: 1,
    magic: 0,
    trust: 0,
    desired_wage: 1,
    rarity: 5,

    skills: base_skill()
}
minor_imp.skills[skills.mining] = 5

const minor_eyeful: character = {
    id: 3,
    name: "Minor Eyeful",
    portrait: "../images/eyeful_minor.png",
    strength: 0,
    vitality: 0,
    magic: 2,
    trust: 0,
    desired_wage: 1,
    rarity: 10,

    skills: base_skill()
}

const slime_black: character = {
    id: 4,
    name: "Black Slime",
    portrait: "../images/slime_black.png",
    strength: 0,
    vitality: 2,
    magic: 0,
    trust: 0,
    desired_wage: 1,
    rarity: 10,

    skills: base_skill()
}

const deel_rub: character = {
    id: 5,
    name: "Deel'Rub",
    portrait: "../images/deel'rub.png",
    strength: 1,
    vitality: 1,
    magic: 3,
    trust: 0,
    desired_wage: 10,
    rarity: 50,

    skills: base_skill()
}
deel_rub.skills[skills.smelting] = 20
deel_rub.skills[skills.smith] = 20

const deel_sar: character = {
    id: 6,
    name: "Deel'Sar",
    portrait: "../images/deel'sar.png",
    strength: 2,
    vitality: 1,
    magic: 4,
    trust: 0,
    desired_wage: 10,
    rarity: 100,

    skills: base_skill()
}
deel_sar.skills[skills.smelting] = 20
deel_sar.skills[skills.smith] = 40

const marela: character = {
    id: 7,
    name: "Deel'Sar",
    portrait: "../images/mar'ela.png",
    strength: 1,
    vitality: 1,
    magic: 6,
    trust: 0,
    desired_wage: 10,
    rarity: 100,

    skills: base_skill()
}
marela.skills[skills.magesmith] = 50

function build_worker_frame(item : character) {
    let entry = document.createElement("div");
    if (item == selected_worker) {
        entry.classList.add("selected-worker")
    }
    let label = document.createElement("div")
    label.innerHTML = item.name + " ID:" + item.id

    let select_button = document.createElement("div");
    select_button.innerHTML = "Select"
    select_button.classList.add("button")
    select_button.onclick = () => {
        selected_worker = item
        update_workers_list();
    }
    let image_div = document.createElement("img");
    image_div.src = item.portrait

    entry.appendChild(label)
    entry.appendChild(image_div)
    entry.appendChild(new_label("Strength: " + item.strength))
    entry.appendChild(new_label("Vitality: " + item.vitality))
    entry.appendChild(new_label("Magic: " + item.magic))

    for (let i = 0; i < skills.total; i++) {
        let skill_label = new_label(skill_names[i] + ": " + item.skills[i])
        skill_label.id = "skill_"+i + "_" + item.id
        entry.appendChild(skill_label)
    }

    entry.appendChild(select_button)

    return entry
}

const workers = [player]
var selected_worker = player

const daemons_pool = [minor_imp, imp, deel_rub, deel_sar]

function new_worker(character: character) {
    for (let item of workers) {
        if (item.id == character.id) {
            item.trust += 1
            return
        }
    }
    workers.push(character)
}

function pull_daemon_characters() {
    if (inventory[commodity.magic_crystals] < 1000) {
        return
    }

    inventory[commodity.magic_crystals] -= 1000

    let total_weight = 0
    for (let item of daemons_pool) {
        total_weight += 1 / item.rarity
    }

    for (let i = 0; i < 10; i++) {
        let roll = Math.random() * total_weight;

        for (let item of daemons_pool) {
            roll -= 1 / item.rarity
            if (roll < 0) {
                new_worker(item);
                document.getElementById("gacha-history")!.appendChild(new_label(item.name))
                break;
            }
        }
    }
    update_workers_list();
}

function update_workers_list() {
    let frame = document.getElementById("workers-frame")
    if (frame == undefined) {
        alert("No workers frame")
        return;
    }

    frame.innerHTML = "";
    for (let item of workers) {
        frame.appendChild(build_worker_frame(item))
    }
}

const coal_mine: building_definition = {
    name: "Coal Mine",
    inputs: [],
    tools: [
        {commodity: commodity.pickaxe, amount: 1}
    ],
    outputs: [
        {commodity: commodity.coal, amount: 1}
    ],
    cost: [
        {commodity: commodity.pickaxe, amount: 2}
    ],
    strength_multiplier: 1,
    vitality_multiplier: 1,
    magic_multiplier: 1,
    skill: skills.mining
}

const ore_mine: building_definition = {
    name: "Ore Mine",
    inputs: [],
    tools: [
        {commodity: commodity.pickaxe, amount: 1}
    ],
    outputs: [
        {commodity: commodity.ore, amount: 1}
    ],
    cost: [
        {commodity: commodity.pickaxe, amount: 2}
    ],
    strength_multiplier: 1,
    vitality_multiplier: 1,
    magic_multiplier: 1,
    skill: skills.mining
}

const smelter: building_definition = {
    name: "Smelter",
    inputs: [
        {commodity: commodity.coal, amount: 1},
        {commodity: commodity.ore, amount: 1}
    ],
    tools: [
        {commodity: commodity.shovel, amount: 1}
    ],
    outputs: [
        {commodity: commodity.ingot, amount: 1}
    ],
    cost: [
        {commodity: commodity.bricks, amount: 2}
    ],
    strength_multiplier: 1,
    vitality_multiplier: 0,
    magic_multiplier: 1,
    skill: skills.smelting
}

const magesmith : building_definition = {
    name: "Magesmith",
    inputs: [
        {commodity: commodity.ingot, amount: 1}
    ],
    tools: [
        {commodity: commodity.magic_tools, amount: 1}
    ],
    outputs: [
        {commodity: commodity.magic_tools, amount: 1}
    ],
    cost: [
        {commodity: commodity.anvil, amount: 2}
    ],
    strength_multiplier: 0,
    vitality_multiplier: 0,
    magic_multiplier: 1,
    skill: skills.magesmith
}

const well: building_definition = {
    name: "Well",
    inputs: [

    ],
    tools: [

    ],
    outputs: [
        {commodity: commodity.water, amount: 1}
    ],
    cost: [
        {commodity: commodity.shovel, amount: 1}
    ],
    strength_multiplier: 1,
    vitality_multiplier: 0,
    magic_multiplier: 0,
    skill: skills.movement
}

const condensor: building_definition = {
    name: "Magic Condensor",
    inputs: [
        {commodity: commodity.water, amount: 100}
    ],
    tools: [
    ],
    outputs: [
        {commodity: commodity.magic_crystals, amount: 1}
    ],
    cost: [
        {commodity: commodity.magic_tools, amount: 1}
    ],
    strength_multiplier: 0,
    vitality_multiplier: 0,
    magic_multiplier: 1,
    skill: skills.enchanting
}


interface building{
    id: number
    definition: building_definition
}

const worker_to_building: Map<number, building> = new Map();
const building_to_worker: Map<number, character> = new Map();

function employ(worker: character, building: building) {
    let old_employer = worker_to_building.get(worker.id)
    let old_worker = building_to_worker.get(building.id)

    if (old_employer) {
        building_to_worker.delete(old_employer.id)
    }
    if (old_worker) {
        worker_to_building.delete(old_worker.id)
    }

    worker_to_building.set(worker.id, building)
    building_to_worker.set(building.id, worker)
}

const property: building[] = []
var property_vacant_id = 0;
function new_building(def: building_definition): number {
    property[property_vacant_id] = {
        id: property_vacant_id,
        definition: def
    }
    property_vacant_id++
    return property_vacant_id
}
new_building(ore_mine)

function build_new_building(def: building_definition): number|undefined {
    let enough_goods = true;
    for (let item of def.cost) {
        if (inventory[item.commodity] < item.amount) {
            enough_goods = false
        }
    }
    if (!enough_goods) return undefined

    for (let item of def.cost) {
        inventory[item.commodity] -= item.amount
    }

    return new_building(def)
}

function div_building_definition(def: building_definition) {
    let frame = document.createElement("div")
    let label = document.createElement("div")
    label.innerHTML = def.name

    frame.appendChild(label)

    frame.appendChild(div_commodity_set("Inputs", def.inputs))
    frame.appendChild(div_commodity_set("Outputs", def.outputs))
    frame.appendChild(div_commodity_set("Tools", def.tools))
    frame.appendChild(div_commodity_set("Cost", def.cost))

    let stats = new_div();
    stats.appendChild(new_label("Multipliers"))
    stats.appendChild(new_label("Strength " + def.strength_multiplier))
    stats.appendChild(new_label("Vitality " + def.vitality_multiplier))
    stats.appendChild(new_label("Magic " + def.magic_multiplier))
    frame.appendChild(stats)

    let button = document.createElement("div")
    button.classList.add("button")
    button.innerText = "Build"
    button.onclick = (() => {build_new_building(def); update_property_list()});
    frame.appendChild(button)

    return frame
}

function update() {
    //decay inventory and set baseline demand/supply:
    for (let i = 0; i < commodity.total; i++) {
        let decay = Math.floor(0.0001 * inventory[i])
        if (decay == 0) {
            if (Math.random() < 0.0001 * inventory[i]) {
                decay = 1
            }
        }
        inventory[i] -= decay
        inventory[i] = Math.max(0, inventory[i])

        local_demand[i] = commodity_definition[i].base_spendings / price[i]
        local_supply[i] = commodity_definition[i].base_production * (1 + price[i] / 100)
    }

    // try to buy/sell
    // suppose we can always buy and sell
    for (let i = 0; i < commodity.total; i++) {
        if (trade[i] > 0) { //buy
            if (inventory[commodity.coins] > trade[i] * price[i]) {
                inventory[commodity.coins] -= trade[i] * price[i]
                local_demand[i] += trade[i]
                inventory[i] += trade[i]
            }
        } else { //sell
            if (inventory[i] + trade[i] > 0) {
                inventory[i] += trade[i]
                local_supply[i] -= trade[i]
                inventory[commodity.coins] -= trade[i] * price[i]
            }
        }
    }

    // change prices
    for (let i = 0; i < commodity.total; i++) {
        if (local_demand[i] < local_supply[i]) {
            price[i] = Math.max(1, price[i] - 1)
        } else {
            price[i] = price[i] + 1
        }
    }

    const reserved_inventory: number[] = [];;
    reserved_inventory.length = commodity.total;
    reserved_inventory.fill(0, 0, commodity.total)
    for (let building of property) {
        let worker = building_to_worker.get(building.id)
        if (!worker) continue;
        let max_throughput =
            building.definition.magic_multiplier * worker.magic
            + building.definition.strength_multiplier * worker.strength
            + building.definition.vitality_multiplier * worker.vitality

        let have_tools = true
        for (let item of building.definition.tools) {
            if (inventory[item.commodity] - reserved_inventory[item.commodity] < item.amount) {
                have_tools = false
            }
        }
        if (have_tools) {
            max_throughput = max_throughput * 2;
        }
        max_throughput = max_throughput * 0.1 + worker.skills[building.definition.skill] * 0.01

        let input_multiplier = 1
        for (let item of building.definition.inputs) {
            if (inventory[item.commodity] - reserved_inventory[item.commodity] < item.amount * max_throughput) {
                input_multiplier = Math.min(input_multiplier, inventory[item.commodity] - reserved_inventory[item.commodity] / (item.amount * max_throughput))
            }
        }
        max_throughput = max_throughput * input_multiplier

        for (let item of building.definition.inputs) {
            const spent = Math.round(item.amount * max_throughput + 0.5)
            inventory[item.commodity] -= spent
            inventory[item.commodity] = Math.max(0, inventory[item.commodity])
        }
        for (let item of building.definition.outputs) {
            const produced = item.amount * max_throughput
            inventory[item.commodity] += Math.floor(produced)
            if (Math.random() < produced - Math.floor(produced)) {
                inventory[item.commodity] += 1
            }
        }
        for (let item of building.definition.tools) {
            reserved_inventory[item.commodity] += item.amount * max_throughput
        }
    }
}



function update_property_list() {
    let frame = document.getElementById("property-frame")
    if (frame == undefined) {
        alert("No property frame")
        return;
    }

    frame.innerHTML = "";
    for (let item of property) {
        let row = document.createElement("div");
        row.id = "b" + item.id;
        row.innerHTML = item.definition.name + " ID:" + item.id
        let hire_button = document.createElement("div");
        hire_button.classList.add("button")
        hire_button.innerHTML = "Hire selected worker in this building"
        hire_button.onclick = () => {
            employ(selected_worker, item);
            update_property_list();
        }
        let worker_div = document.createElement("div")
        let image_div: HTMLImageElement|undefined = undefined
        if (building_to_worker.has(item.id)) {
            worker_div.innerHTML = "Worker: " + building_to_worker.get(item.id)!.name
            image_div = document.createElement("img");
            image_div.src = building_to_worker.get(item.id)!.portrait
        } else {
            worker_div.innerHTML = "Worker: None"
        }

        frame.appendChild(row)
        frame.appendChild(hire_button)
        frame.appendChild(worker_div)
        if (image_div) frame.appendChild(image_div)
    }
}


window.onload = () => {

    init_inventory_frame()
    update_workers_list()
    update_property_list()

    {
        let frame = document.getElementById("control-frame")
        if (frame == undefined) {
            alert("No control frame")
            return;
        }

        frame.appendChild(div_building_definition(ore_mine));
        frame.appendChild(div_building_definition(coal_mine));
        frame.appendChild(div_building_definition(smelter));
        frame.appendChild(div_building_definition(magesmith));
        frame.appendChild(div_building_definition(well));
        frame.appendChild(div_building_definition(condensor));
    }

    document.getElementById("gacha-button")!.onclick = pull_daemon_characters

    let update_timer = 0;
    let start = undefined


    function callback(timestamp) {
        if (start == undefined) {
            start = timestamp
        }
        let dt = timestamp - start!
        update_timer += dt;
        while (update_timer > 100) {
            update_timer -= 100
            update()
            update_inventory_frame()
        }
        start = timestamp
        window.requestAnimationFrame(callback)
    }
    window.requestAnimationFrame(callback)
}

