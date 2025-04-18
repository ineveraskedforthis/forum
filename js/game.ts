const new_div = () => {return document.createElement("div")}
const new_label = (label: string) => {let d = document.createElement("div"); d.innerHTML = label; return d}

function new_button(label: string, callback: ()=>void) {
    let d = document.createElement("div");
    d.innerHTML = label;
    d.onclick = callback
    d.classList.add("button")
    return d
}

function new_contract_volume_label(contract: number) {
    let d = document.createElement("div");
    d.innerHTML = "Remaining volume: " + contracts[contract].expected_volume?.toFixed(2);
    d.classList.add("contract" + contract + "volume")
    return d
}

function update_all_contract_volume_labels(contract: number) {
    let query_result = document.querySelectorAll(".contract" + contract + "volume")
    query_result.forEach((value, i, p) => {
        value.innerHTML = "Remaining volume: " + contracts[contract].expected_volume?.toFixed(2);
    })
}

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
    export const corpses = 16
    export const essence = 17
    export const ore_source = 18
    export const coal_source = 19
    export const rural_land = 20
    export const urban_land = 21
    export const energy_generator = 22
    export const raw_labour = 23
    export const magical_labour = 24
    export const artisan_labour = 25
    export const smith_labour = 26
    // export const inner_energy = 27
    export const total = 27
}

const good_currency : number[] = [commodity.coins, commodity.essence, commodity.ore, commodity.magic_crystals]

interface commodity_data {
    name: string,
    decay: number
}

const commodity_definition: commodity_data[] = []
commodity_definition[commodity.coins] = {
    name: "Coins",
    decay: 0,
}
commodity_definition[commodity.fluids] = {
    name: "Fluids",
    decay: 0.1,
}
commodity_definition[commodity.blood] = {
    name: "Blood",
    decay: 0.1,
}
commodity_definition[commodity.water] = {
    name: "Water",
    decay: 0,
}
commodity_definition[commodity.weapons] = {
    name: "Weapons",
    decay: 0,
}
commodity_definition[commodity.enchanted_weapons] = {
    name: "Enchanted Weapons",
    decay: 0,
}
commodity_definition[commodity.magic_crystals] = {
    name: "Magic crystals",
    decay: 0,
}
commodity_definition[commodity.ore] = {
    name: "Ore",
    decay: 0,
}
commodity_definition[commodity.ingot] = {
    name: "Ingots",
    decay: 0,
}
commodity_definition[commodity.coal] = {
    name: "Coal",
    decay: 0,
}
commodity_definition[commodity.anvil] = {
    name: "Anvil",
    decay: 0,
}
commodity_definition[commodity.pickaxe] = {
    name: "Pickaxe",
    decay: 0,
}
commodity_definition[commodity.shovel] = {
    name: "Shovel",
    decay: 0,
}
commodity_definition[commodity.magic_tools] = {
    name: "Magic Tools",
    decay: 0,
}
commodity_definition[commodity.bricks] = {
    name: "Bricks",
    decay: 0,
}
commodity_definition[commodity.clay] = {
    name: "Clay",
    decay: 0,
}
commodity_definition[commodity.corpses] = {
    name: "Corpses",
    decay: 0.1
}
commodity_definition[commodity.essence] = {
    name: "Essence",
    decay: 0
}
commodity_definition[commodity.ore_source] = {
    name: "Ore Source",
    decay: 0
}
commodity_definition[commodity.coal_source] = {
    name: "Coal Source",
    decay: 0
}
commodity_definition[commodity.rural_land] = {
    name: "Rural Land Plot",
    decay: 0
}
commodity_definition[commodity.urban_land] = {
    name: "Urban Land Plot",
    decay: 0
}
commodity_definition[commodity.energy_generator] = {
    name: "Energy Generator",
    decay: 0
}
commodity_definition[commodity.raw_labour] = {
    name: "Labour",
    decay: 1
}
commodity_definition[commodity.magical_labour] = {
    name: "Mage Labour",
    decay: 1
}
commodity_definition[commodity.artisan_labour] = {
    name: "Artisanal labour",
    decay: 1
}
commodity_definition[commodity.smith_labour] = {
    name: "Smith labour",
    decay: 1
}

function inventory() {
    let a : number[] = []
    a.length = commodity.total
    a.fill(0, 0, a.length)
    return a
}

enum quality {
    common, high
}

interface demand {
    label: string,
    commodity: number,
    amount: number,
    inventory: number,
    contracted: boolean,
    required_quality: quality
}
interface supply {
    label: string,
    commodity: number,
    amount: number,
    inventory: number,
    contracted: boolean,
    inputs: number[],
    quality: quality
}
interface contract {
    seller: number,
    seller_character: number,
    customer: number,
    customer_character: number,
    negotiated_price: number,
    currency: number,
    expected_volume: number|undefined,
    base_expected_volume: number,
    locked_currency: number,
    active: boolean,
    ai: boolean,
}
interface player_contract {
    contract_id: number
    target_character: number
}

interface production {
    inputs: number[]
    production: number
}

interface building_definition {
    name: string
    production: number
    tools: number[]
    cost: number[]
}

enum character_rank {
    player,
    summoned,
    lord
}


interface character {
    name: string
    portrait: string
    currency_storage: number[]
    base_supply: number[]
    rank: character_rank
    conversion_rate: number[]
}

interface building{
    definition: building_definition
    owner: number
}

// DEMAND ARRAYS
const demand_data : demand[] = []
function new_demand(commodity: number, amount: number, quality: quality): number {
    demand_data.push({
        label: "",
        commodity: commodity,
        amount: amount,
        inventory: 0,
        contracted: false,
        required_quality: quality
    })
    return demand_data.length - 1;
}

// SUPPLY ARRAYS
const supply_data : supply[] = []
function new_supply(commodity: number, amount: number, quality: quality, inputs: number[], starting_amount?: number): number {
    if (starting_amount == undefined) {
        starting_amount = 0
    }
    supply_data.push({
        label: "",
        commodity: commodity,
        amount: amount,
        inventory: starting_amount,
        contracted: false,
        inputs: inputs,
        quality: quality
    })
    return supply_data.length - 1;
}

// CONTRACT ARRAYS
const contracts : contract[] = []
function new_contract(seller: number, seller_character: number, customer: number, customer_character: number, negotiated_price: number, currency: number, ai: boolean) {
    contracts.push({
        seller: seller,
        seller_character: seller_character,
        customer: customer,
        customer_character: customer_character,
        active: true,
        negotiated_price: negotiated_price,
        currency: currency,
        expected_volume: undefined,
        base_expected_volume: 0,
        locked_currency: 0,
        ai: ai
    })
}

const changed_supply_prices : Map<number, boolean> = new Map;

function update_contracts() {
    // let changed = false;
    // for (let contract of contracts) {
    //     if (!contract.ai) {
    //         continue
    //     }
    //     if (changed_supply_prices.has(contract.seller)) {
    //         renegotiate_price_non_player_contract(contract)
    //         changed = true
    //     }
    // }
    // changed_supply_prices.clear()

    // if (changed) {
    //     let lords_frame = document.getElementById("lords-frame")!
    //     lords_frame.innerHTML = ""
    //     for (let lord of known_lords) {
    //         lords_frame.appendChild(make_lord_div(lord))
    //     }
    // }
}
// CHARACTER ARRAYS
const characters: character[] = []
function new_character(name: string, portrait: string, rank: character_rank, base_supply: number[]) {
    let conversion_rate : number[] = []
    conversion_rate.length = commodity.total * commodity.total
    conversion_rate.fill(1, 0, commodity.total * commodity.total)

    characters.push({
        name: name,
        portrait: portrait,
        currency_storage: inventory(),
        // monetary_preference: currency,
        rank: rank,
        base_supply: base_supply,
        conversion_rate: conversion_rate
    })

    return characters.length - 1
}

function get_price(conversion_matrix: number[], priced_commodity: number, currency: number) {
    return conversion_matrix[priced_commodity * commodity.total + currency]
}

function set_price(conversion_matrix: number[], priced_commodity: number, currency: number, value: number) {
    conversion_matrix[priced_commodity * commodity.total + currency] = value
}

// BUILDING ARRAYS
const buildings_data: building[] = []
const worker_to_building: Map<number, number> = new Map();
const building_to_worker: Map<number, number> = new Map();
const owner_to_buildings: Map<number, number[]> = new Map();

function new_building(owner: number, def: building_definition): number {
    buildings_data.push({
        owner: owner,
        definition: def
    })
    let id = buildings_data.length - 1
    let ownership = owner_to_buildings.get(owner)
    if(ownership) {
        ownership.push(id)
    } else {
        owner_to_buildings.set(owner, [id])
    }
    return id
}


const MAX_PRICE = 100000;
const DIRECT_PROCUREMENT_PRICE_MULTIPLIER = 10;
const RESOURCE_DRAIN_PER_TICK = 0.0001

function init_inventory_frame(lord : character) {
    let frame = document.getElementById("inventory-frame")
    if (frame == undefined) {
        alert("No inventory frame")
        return;
    }
    frame.innerHTML = ""
    for (let i of good_currency) {
        let item = document.createElement("div");
        item.classList.add("row")
        let label = document.createElement("div")
        label.innerHTML = commodity_definition[i].name
        let have = document.createElement("div")
        have.id = "inv" + i
        have.innerHTML = "Have: " + lord.currency_storage[i].toFixed(2)
        frame.appendChild(item)
        item.appendChild(label)
        item.appendChild(have)
    }
}

function update_inventory_frame() {
    for (let i of good_currency) {
        let have = document.getElementById("inv" + i)!
        have.innerHTML = "Have: " + characters[player_index].currency_storage[i].toFixed(2)
    }
}

function select_supply_callback(index: number) {
    return () => {
        selected_supply = index
        update_lords_frame()
    }
}

function select_demand_callback(index: number) {
    return () => {
        selected_demand = index
        update_lords_frame()
    }
}

function new_supply_inventory_label(index: number) {
    let inventory_label = document.createElement("div")
    inventory_label.classList.add("s-inv-"+index)
    inventory_label.innerHTML = "Inventory: " + supply_data[index].inventory.toFixed(2)
    return inventory_label
}

function new_demand_inventory_label(index: number) {
    let inventory_label = document.createElement("div")
    inventory_label.classList.add("d-inv-"+index)
    inventory_label.innerHTML = "Inventory: " + demand_data[index].inventory.toFixed(2)
    return inventory_label
}

function update_all_inventory_labels_supply() {
    for (let i = 0; i < supply_data.length; i++) {
        let query = ".s-inv-"+i
        let result = document.querySelectorAll(query)
        result.forEach((value) => {value.innerHTML = "Inventory: " + supply_data[i].inventory.toFixed(2)})
    }
}
function update_all_inventory_labels_demand() {
    for (let i = 0; i < demand_data.length; i++) {
        let query = ".d-inv-"+i
        let result = document.querySelectorAll(query)
        result.forEach((value) => {value.innerHTML = "Inventory: " + demand_data[i].inventory.toFixed(2)})
    }
}

function select_supply_div(index: number) {
    let row = document.createElement("div")
    row.classList.add("row")
    let data = supply_data[index]
    row.appendChild(new_label(data.amount.toFixed(5)))
    row.appendChild(new_label(commodity_definition[data.commodity].name))
    row.appendChild(new_supply_inventory_label(index))
    if (data.quality == quality.common) {
        row.appendChild(new_label("Common Quality"))
    } else {
        row.appendChild(new_label("High Quality"))
    }
    row.appendChild(new_button("Select", select_supply_callback(index)))
    return row
}

function select_demand_div(index: number) {
    let row = document.createElement("div")
    row.classList.add("row")
    let data = demand_data[index]
    row.appendChild(new_label(data.amount.toFixed(5)))
    row.appendChild(new_label(commodity_definition[data.commodity].name))
    row.appendChild(new_demand_inventory_label(index))
    if (data.required_quality == quality.common) {
        row.appendChild(new_label("Common Quality"))
    } else {
        row.appendChild(new_label("High Quality"))
    }
    row.appendChild(new_button("Select", select_demand_callback(index)))
    return row
}

function update_player_supply_and_demand() {
    // personal player's supply:
    let player = characters[player_index]
    {
        let frame = document.getElementById("player-supply")
        if (frame == undefined) {
            alert("supply frame not found")
            return;
        }
        frame.innerHTML = ""
        for (let player_supply of player.base_supply) {
            frame.appendChild(select_supply_div(player_supply))
        }
        for (let building of buildings_data) {
            frame.appendChild(select_supply_div(building.definition.production))
        }

        frame.appendChild(new_label("Stockpiles:"))
        for (let stockpile of stockpiles) {
            frame.appendChild(select_supply_div(stockpile))
        }
    }

    {
        let frame = document.getElementById("player-demand")
        if (frame == undefined) {
            alert("demand frame not found")
            return;
        }
        frame.innerHTML = ""
        for (let player_supply of player.base_supply) {
            for (let player_demand of supply_data[player_supply].inputs) {
                frame.appendChild(select_demand_div(player_demand))
            }
        }
        for (let building of buildings_data) {
            for (let player_demand of supply_data[building.definition.production].inputs) {
                frame.appendChild(select_demand_div(player_demand))
            }
        }
        frame.appendChild(new_label("Currency conversions:"))
        for (let conversion of convert_to_currency) {
            let supply = supply_data[conversion]
            frame.appendChild(select_demand_div(supply.inputs[0]))
        }

        frame.appendChild(new_label("Stockpiles:"))
        for (let stockpile of stockpiles) {
            frame.appendChild(select_demand_div(supply_data[stockpile].inputs[0]))
        }
    }

}



interface commodity_box {
    commodity: number
    amount: number
}

function div_demand(label: string, demand_index: number) {
    let data = demand_data[demand_index]
    let frame = new_div()
    frame.appendChild(new_label(label))

    {
        let item_div = new_div()
        item_div.classList.add("row")

        let name_div = new_div()
        let count_div = new_div()

        name_div.innerHTML = commodity_definition[data.commodity].name
        count_div.innerHTML = data.amount.toString()

        item_div.appendChild(name_div)
        item_div.appendChild(count_div)

        frame.appendChild(item_div)
    }

    return frame
}

function div_supply(label: string, supply_index: number) {
    let data = supply_data[supply_index]

    let frame = new_div()
    let label_div = new_div()
    label_div.innerHTML = label
    frame.appendChild(label_div)

    {
        let item_div = new_div()
        item_div.classList.add("row")

        let name_div = new_div()
        let count_div = new_div()

        name_div.innerHTML = commodity_definition[data.commodity].name
        count_div.innerHTML = data.amount.toString()

        item_div.appendChild(name_div)
        item_div.appendChild(count_div)

        frame.appendChild(item_div)
    }

    for (let input_index of data.inputs) {
        let input_data = demand_data[input_index]

        let item_div = new_div()
        item_div.classList.add("row")

        let name_div = new_div()
        let count_div = new_div()

        name_div.innerHTML = commodity_definition[input_data.commodity].name
        count_div.innerHTML = input_data.amount.toString()

        item_div.appendChild(name_div)
        item_div.appendChild(count_div)

        frame.appendChild(item_div)
    }

    return frame
}


// contracts can be established only in one currency
const the_smelter = new_character(
    "The Smelter", "../images/smelter.png",
    character_rank.lord,
    [new_supply(commodity.ingot, 100, quality.high, [
        new_demand(commodity.ore, 100, quality.common),
        new_demand(commodity.coal, 100, quality.common)
    ], 0)]
)

characters[the_smelter].currency_storage[commodity.essence] = 1000

const the_smith = new_character(
    "The Smith", "../images/smith.png",
    character_rank.lord,
    [new_supply(commodity.smith_labour, 100, quality.high, [], 0)]
)
characters[the_smith].currency_storage[commodity.essence] = 1000

const crystal_lord = new_character(
    "The Crystal Dealer", "../images/crystal.png",
    character_rank.lord,
    [new_supply(commodity.magic_crystals, 1, quality.common, [
        new_demand(commodity.essence, 1, quality.common)
    ])]
)
characters[crystal_lord].currency_storage[commodity.ore] = 1000
supply_data[characters[crystal_lord].base_supply[0]].inventory = 1000


const landlord0 = new_character(
    "The Mayor", "../images/landlord_0.png",
    character_rank.lord,
    [
        new_supply(commodity.urban_land, 0, quality.common, [], 1000),
        new_supply(commodity.coal_source, 0, quality.common, [], 1000),
        new_supply(commodity.ore_source, 0, quality.common, [], 1000),
    ]
)
characters[landlord0].currency_storage[commodity.essence] = 1000

const merchant = new_character(
    "The Merchant", "../images/merchant.png",
    character_rank.lord,
    [
        new_supply(commodity.coal, 1, quality.common, [], 1000),
        new_supply(commodity.ore, 1, quality.common, [], 1000),
        new_supply(commodity.water, 1, quality.common, [], 1000),
    ]
)
characters[merchant].currency_storage[commodity.essence] = 1000

const currency_trader = new_character(
    "The Coiner", "../images/coiner.png",
    character_rank.lord,
    [
    ]
)

for (let currency of good_currency) {
    characters[currency_trader].base_supply.push(
        new_supply(currency, 100, quality.common, [], 10000)
    )
    characters[currency_trader].currency_storage[currency] = 100000
}

const warrior = new_character(
    "The Warrior", "../images/warrior.png",
    character_rank.lord,
    [
        new_supply(commodity.corpses, 100, quality.common, [
            new_demand(commodity.enchanted_weapons, 1, quality.common)
        ], 1000),
    ]
)
characters[warrior].currency_storage[commodity.essence] = 1000

const mage = new_character(
    "The Mage", "../images/mage.png",
    character_rank.lord,
    [
        new_supply(commodity.energy_generator, 1, quality.high, [
            new_demand(commodity.magic_tools, 50, quality.high)
        ], 1000),
    ]
)
characters[mage].currency_storage[commodity.essence] = 1000

// function buy_from_supply(item: supply, x: number, monetary_commodity: number) {
//     if (item.inventory < x) {
//         x = item.inventory
//     }
//     if (inventory[monetary_commodity] < x * item.price * DIRECT_PROCUREMENT_PRICE_MULTIPLIER) {
//         x = inventory[monetary_commodity] / item.price / DIRECT_PROCUREMENT_PRICE_MULTIPLIER
//     }
//     item.inventory -= x;
//     inventory[item.commodity] += x
//     inventory[monetary_commodity] -= x * item.price * DIRECT_PROCUREMENT_PRICE_MULTIPLIER
// }

// function buy_from_supply_callback(item: supply, x: number, monetary_commodity: number) {
//     return () => {
//         buy_from_supply(item, x, monetary_commodity);
//     }
// }


// function sell_to_demand(item: demand, x: number, monetary_commodity: number) {
//     if (item.inventory > 10) {
//         return
//     }
//     if (inventory[item.commodity] < x) {
//         x = inventory[item.commodity]
//     }
//     item.inventory += x;
//     inventory[item.commodity] -= x
//     inventory[monetary_commodity] += x * item.price / DIRECT_PROCUREMENT_PRICE_MULTIPLIER
// }

// function sell_to_demand_callback(item: demand, x: number, monetary_commodity: number) {
//     return () => {
//         sell_to_demand(item, x, monetary_commodity)
//     }
// }

function negotiate_contract_callback(item: demand|supply) {
    return () => {item.contracted = true};
}

function cancel_contract_callback(item: demand|supply) {
    return () => {item.contracted = false};
}


function create_contract_detailed(
    supplier_character_index: number,
    supply_index: number,

    customer_character_index: number,
    demand_index: number,

    volume: number,
    price: number, currency: number,
    upfront: boolean, ai: boolean
) {
    let supplier = characters[supplier_character_index]
    let supply = supply_data[supply_index]
    let customer = characters[customer_character_index]
    let demand = demand_data[demand_index]

    if (supply.quality < demand.required_quality) {
        alert("Not enough quality")
        return;
    }

    let locked = 0
    if (upfront) {
        locked = volume * price
    }
    if (customer.currency_storage[currency] < locked) {
        alert(`Not enough currency. Requires ${locked} ${commodity_definition[currency].name}`)
        return;
    }
    customer.currency_storage[currency] -= locked

    // negotiate a new contract
    let new_contract: contract = {
        seller: supply_index,
        seller_character: supplier_character_index,
        customer: demand_index,
        customer_character: customer_character_index,
        negotiated_price: price,
        currency: currency,
        locked_currency: locked,
        expected_volume: volume,
        base_expected_volume: volume,
        active: true,
        ai: ai
    }
    contracts.push(new_contract)
}

function price_multiplier(volume: number, upfront: boolean) {
    let base = 1.1;
    if (upfront) {
        base = 1.01
    }
    let log2 = Math.floor(Math.log2(volume) + 0.5)
    return base * Math.max(1, 2 - log2 / 10)
}

function supply_negotiation_conclusion_callback(
    lord_index: number, supply_index: number, player_demand_index: number,
    volume: number, price: number, currency: number, upfront: boolean
) {
    return () => {
        create_contract_detailed(lord_index, supply_index, player_index, player_demand_index, volume, price, currency, upfront, false)
        start_supply_negotiation(lord_index, supply_index, player_demand_index)
    }
}
function demand_negotiation_conclusion_callback(
    lord_index: number, player_supply_index: number, demand_index: number,
    volume: number, price: number, currency: number, upfront: boolean
) {
    return () => {
        create_contract_detailed(player_index, player_supply_index, lord_index, demand_index, volume, price, currency, upfront, false)
        start_demand_negotiation(lord_index, player_supply_index, demand_index)
    }
}

function start_supply_negotiation(lord_index: number, supply_index: number, player_demand_index: number) {
    let lord = characters[lord_index]

    let frame = document.createElement("div")

    let supply = supply_data[supply_index]
    let demand = demand_data[player_demand_index]

    let potential_currency: number[] = []
    for (let candidate of good_currency) {
        if (lord.currency_storage[candidate] > 0) {
            potential_currency.push(candidate)
        }
    }

    let commodity = commodity_definition[supply.commodity]
    let top_frame = document.createElement("div")
    top_frame.classList.add("negotiation-grid")

    let description_frame = document.createElement("div")
    description_frame.appendChild(new_label("Negotiations with " + lord.name))
    description_frame.appendChild(new_label("On topic of"))
    description_frame.appendChild(new_label("Procurement of " + commodity.name))
    description_frame.appendChild(new_label("Buyer: (You)"))
    description_frame.appendChild(new_label("Seller: " + lord.name))

    let portrait_frame = document.createElement("div")
    let img = document.createElement("img");
    img.src = lord.portrait
    portrait_frame.appendChild(img)

    top_frame.appendChild(description_frame)
    top_frame.appendChild(portrait_frame)

    frame.appendChild(top_frame)

    let details_frame = document.createElement("div")

    // look for existing contract:
    let contract: number|undefined = undefined
    for (let i = 0; i < contracts.length; i++) {
        let item = contracts[i]
        if (item.seller == supply_index && item.customer == player_demand_index) {
            contract = i
        }
    }

    if (contract == undefined) {
        details_frame.appendChild(new_label(`Currently, you have no active contracts related to this supply-demand link`));
        details_frame.appendChild(new_label(`${lord.name} suggests the following options:`))

        let volumes = [5, 200, 1000]
        let upfront = [false, true]

        for (let currency of potential_currency) {
            let currency_name = commodity_definition[currency].name
            for (let flag of upfront) {
                for (let volume of volumes){
                    let price = get_price(lord.conversion_rate, supply.commodity, currency) * price_multiplier(volume, flag);
                    let adjective = "continuous"
                    if (flag) {
                        adjective = "upfront"
                    }
                    details_frame.appendChild(
                        new_button(
                            `Negotiate procurement of ${volume} units with ${adjective} cost of ${(price * volume).toFixed(2)} ${currency_name}`,
                            supply_negotiation_conclusion_callback(lord_index, supply_index, player_demand_index, volume, price, currency, flag)
                        )
                    )
                }
            }
        }
    } else {
        let details = contracts[contract]
        let supply = supply_data[details.seller]
        details_frame.appendChild(new_label(`You have negotiated to procure ${commodity.name} with price equal to ${contracts[contract].negotiated_price.toFixed(2)} ${commodity_definition[contracts[contract].currency].name} per unit`));
        details_frame.appendChild(new_contract_volume_label(contract))

        let volume = details.expected_volume;
        if (volume != undefined)  {
            details_frame.appendChild(new_button(`Extend contract ${details.base_expected_volume}`, () => {
                details.expected_volume = volume + details.base_expected_volume
            }))
        }
    }

    frame.appendChild(details_frame)

    let negotiation_frame = document.getElementById("negotiation")
    if (negotiation_frame == undefined) {
        alert("no negotiation div")
        return
    }

    negotiation_frame.innerHTML = ""
    negotiation_frame.appendChild(frame)
}

function start_supply_negotiation_callback(lord_index: number, supply_index: number, demand_index) {
    return ()=>{start_supply_negotiation(lord_index, supply_index, demand_index)}
}

function start_demand_negotiation(lord_index: number, player_supply_index: number, demand_index: number) {
    let frame = document.createElement("div")

    let lord = characters[lord_index]
    let supply = supply_data[player_supply_index]
    let demand = demand_data[demand_index]
    let commodity = commodity_definition[demand.commodity]

    let potential_currency: number[] = []
    for (let candidate of good_currency) {
        if (lord.currency_storage[candidate] > 0) {
            potential_currency.push(candidate)
        }
    }

    let top_frame = document.createElement("div")
    top_frame.classList.add("negotiation-grid")

    let description_frame = document.createElement("div")
    description_frame.appendChild(new_label("Negotiations with " + lord.name))
    description_frame.appendChild(new_label("On topic of"))
    description_frame.appendChild(new_label("Procurement of " + commodity.name))
    description_frame.appendChild(new_label("Buyer: "+ lord.name))
    description_frame.appendChild(new_label("Seller: (You)" ))

    let portrait_frame = document.createElement("div")
    let img = document.createElement("img");
    img.src = lord.portrait
    portrait_frame.appendChild(img)

    top_frame.appendChild(description_frame)
    top_frame.appendChild(portrait_frame)

    frame.appendChild(top_frame)

    let details_frame = document.createElement("div")

    // look for existing contract:
    let contract: number|undefined = undefined
    for (let i = 0; i < contracts.length; i++) {
        let item = contracts[i]
        if (item.seller == player_supply_index && item.customer == demand_index) {
            contract = i
        }
    }

    if (contract == undefined) {
        details_frame.appendChild(new_label(`Currently, you have no contracts active`));
        details_frame.appendChild(new_label(`${lord.name} suggests the following options:`))
        let volumes = [5, 200, 1000]

        for (let currency of potential_currency) {
            let currency_name = commodity_definition[currency].name
            for (let volume of volumes){
                let price = get_price(lord.conversion_rate, demand.commodity, currency) / price_multiplier(volume, false);
                details_frame.appendChild(
                    new_button(
                        `Negotiate procurement of ${volume} units with continuous cost of ${(price * volume).toFixed(2)} ${currency_name}`,
                        demand_negotiation_conclusion_callback(lord_index, player_supply_index, demand_index, volume, price, currency, false)
                    )
                )
            }
        }
    } else {
        let details = contracts[contract]
        let demand = demand_data[details.customer]
        details_frame.appendChild(new_label(`You have negotiated to provide ${commodity.name} with price equal to ${contracts[contract].negotiated_price.toFixed(2)} ${commodity_definition[details.currency].name} per unit`));
        details_frame.appendChild(new_contract_volume_label(contract))

        let volume = details.expected_volume;
        if (volume != undefined)  {
            details_frame.appendChild(new_button(`Extend contract ${details.base_expected_volume}`, () => {
                details.expected_volume = volume + details.base_expected_volume
            }))
        }
    }

    frame.appendChild(details_frame)

    let negotiation_frame = document.getElementById("negotiation")
    if (negotiation_frame == undefined) {
        alert("no negotiation div")
        return
    }

    negotiation_frame.innerHTML = ""
    negotiation_frame.appendChild(frame)
}

function start_demand_negotiation_callback(lord_index: number, supply_index: number, demand_index) {
    return ()=>{start_demand_negotiation(lord_index, supply_index, demand_index)}
}

let selected_supply : number|undefined = undefined
let selected_demand : number|undefined = undefined

function update_lords_frame() {
    let lords_frame = document.getElementById("lords-frame")!
    lords_frame.innerHTML = ""
    for (let lord of known_lords) {
        lords_frame.appendChild(make_lord_div(lord))
    }
}

function make_lord_div(character_index: number) {
    let character = characters[character_index]
    let frame = document.createElement("div")

    frame.appendChild(new_label(character.name))

    let portrait = document.createElement("img")
    portrait.src = character.portrait
    frame.appendChild(portrait);

    // let deals = item.special_deal
    // if (deals != undefined) {
    //     for (let supply_index of deals) {
    //         let deal = supply_data[supply_index]
    //         let buy_one = document.createElement("div")
    //         buy_one.innerHTML = "Buy 1 " + commodity_definition[deal.commodity].name + " for " + deal.price + " " + commodity_definition[item.monetary_preference].name
    //         buy_one.classList.add("button")
    //         buy_one.onclick = buy_from_supply_callback(deal, 1, item.monetary_preference)
    //         frame.appendChild(buy_one)
    //     }
    // }


    for (let method of character.base_supply) {
        let production_frame = document.createElement("div")
        let supply = supply_data[method]

        if (selected_demand != undefined) {
            let player_demand = demand_data[selected_demand]
            if (player_demand.commodity == supply.commodity) {
                production_frame.appendChild(new_button(
                    "Negotiate procurement of " + commodity_definition[supply.commodity].name,
                    start_supply_negotiation_callback(character_index, method, selected_demand)
                ))
            }
        }
        if (selected_supply != undefined) {
            for (let demand_index of supply.inputs) {
                let player_supply = supply_data[selected_supply]
                let demand = demand_data[demand_index]
                if (demand.commodity == player_supply.commodity) {
                    production_frame.appendChild(new_button(
                        "Negotiate procurement of " + commodity_definition[demand.commodity].name,
                        start_demand_negotiation_callback(character_index, selected_supply, method)
                    ))
                }
            }
        }

        frame.appendChild(production_frame)
    }

    return frame
}

const known_lords : number[] = [
    the_smelter, the_smith, crystal_lord, merchant, landlord0, currency_trader, warrior, mage
]

const player_index = new_character(
    "(You)", "../images/player.png",
    character_rank.player,
    [
        new_supply(commodity.magical_labour, 1, 1, [], 0),
        new_supply(commodity.raw_labour, 1, 1, [], 0)
    ]
)

// player can convert goods into currencies like this:
let convert_to_currency: number[] = []
for (let currency of good_currency) {
    {
        convert_to_currency.push(new_supply(currency, 10, 0, [new_demand(currency, 10, 0)]))
        let last_supply = supply_data.length - 1
        let last_demand = demand_data.length - 1
        supply_data[last_supply].label = "To currency"
        demand_data[last_demand].label = "To currency"
    }
}
let stockpiles: number[] = []
for (let quality_level of [quality.common, quality.high]) {
    for (let i = 0; i < commodity.total; i++) {
        stockpiles.push(new_supply(i, 1000, quality_level, [new_demand(i, 1000, quality_level)]))
    }
}


/*
const imp: character = {
    id: 1,
    name: "Large Imp",
    portrait: "../images/imp.png",
    strength: 2,
    vitality: 2,
    magic: 1,
    fluids: 0,
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
    fluids: 0,
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
    fluids: 0,
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
    fluids: 10,
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
    fluids: 1,
    trust: 0,
    desired_wage: 10,
    rarity: 50,

    skills: base_skill()
}
deel_rub.skills[skills.smelting] = 20
deel_rub.skills[skills.smith] = 20
deel_rub.skills[skills.magesmith] = 5

const deel_sar: character = {
    id: 6,
    name: "Deel'Sar",
    portrait: "../images/deel'sar.png",
    strength: 2,
    vitality: 1,
    magic: 4,
    fluids: 1,
    trust: 0,
    desired_wage: 10,
    rarity: 100,

    skills: base_skill()
}
deel_sar.skills[skills.smelting] = 20
deel_sar.skills[skills.smith] = 40
deel_sar.skills[skills.magesmith] = 5

const marela: character = {
    id: 7,
    name: "Mar'Ela",
    portrait: "../images/mar'ela.png",
    strength: 1,
    vitality: 1,
    magic: 6,
    fluids: 2,
    trust: 0,
    desired_wage: 10,
    rarity: 100,

    skills: base_skill()
}
marela.skills[skills.magesmith] = 50

const imp_major: character = {
    id: 8,
    name: "Major Horned Imp",
    portrait: "../images/imp_major.png",
    strength: 5,
    vitality: 5,
    magic: 1,
    fluids: 0,
    trust: 0,
    desired_wage: 10,
    rarity: 50,

    skills: base_skill()
}
imp_major.skills[skills.mining] = 50
imp_major.skills[skills.smith] = 50
imp_major.skills[skills.smelting] = 50

const qab_etua: character = {
    id: 9,
    name: "Qab'Etua",
    portrait: "../images/qab'etua.png",
    strength: 2,
    vitality: 5,
    magic: 5,
    fluids: 3,
    trust: 0,
    desired_wage: 10,
    rarity: 200,

    skills: base_skill()
}
qab_etua.skills[skills.enchanting] = 100
qab_etua.skills[skills.magesmith] = 100

const imp_minor: character = {
    id: 10,
    name: "Minor Imp",
    portrait: "../images/imp_minor.png",
    strength: 1,
    vitality: 1,
    magic: 0,
    fluids: 0,
    trust: 0,
    desired_wage: 1,
    rarity: 10,

    skills: base_skill()
}

const terrom: character = {
    id: 11,
    name: "Ter'Rom",
    portrait: "../images/ter'rom.png",
    strength: 5,
    vitality: 3,
    magic: 0,
    fluids: 0,
    trust: 0,
    desired_wage: 50,
    rarity: 50,

    skills: base_skill()
}
terrom.skills[skills.movement] = 50
terrom.skills[skills.hunting] = 60

const tersia: character = {
    id: 12,
    name: "Ter'Sia",
    portrait: "../images/ter'sia.png",
    strength: 0,
    vitality: 0,
    magic: 1,
    fluids: 0,
    trust: 0,
    desired_wage: 1,
    rarity: 5,

    skills: base_skill()
}
tersia.skills[skills.enchanting] = 20

const terpim: character = {
    id: 13,
    name: "Ter'Pim",
    portrait: "../images/ter'pim.png",
    strength: 0.1,
    vitality: 0.1,
    magic: 0.1,
    fluids: 0,
    trust: 0,
    desired_wage: 1,
    rarity: 5,
    skills: base_skill()
}

const daemons_pool = [
    minor_imp,
    imp,
    deel_rub,
    deel_sar,
    marela,
    imp_major,
    qab_etua,
    imp_minor,
    terrom,
    tersia,
    terpim
]

*/

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

function build_worker_frame(index : number) {
    let item = characters[index]

    let entry = document.createElement("div");
    if (index == selected_worker) {
        entry.classList.add("selected-worker")
    }
    let label = document.createElement("div")
    label.innerHTML = item.name

    let select_button = document.createElement("div");
    select_button.innerHTML = "Select"
    select_button.classList.add("button")
    select_button.onclick = () => {
        selected_worker = index
        update_workers_list();
    }
    let image_div = document.createElement("img");
    image_div.src = item.portrait

    entry.appendChild(label)
    entry.appendChild(image_div)
    for (let supply of item.base_supply) {
        let details = supply_data[supply]
        let production_label = new_label(`Produces: ${details.amount} ${commodity_definition[details.commodity].name} of ${details.quality} quality.`)
        entry.appendChild(production_label)
    }
    entry.appendChild(select_button)
    return entry
}

const workers = [player_index]
var selected_worker = player_index

/*
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
    if (inventory[commodity.magic_crystals] < 500) {
        return
    }

    inventory[commodity.magic_crystals] -= 500

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



function update_skills() {
    for (let item of workers) {
        for (let i = 0; i < skills.total; i++) {
            let e = document.getElementById("skill_"+i + "_" + item.id)!
            e.innerHTML = skill_names[i] + ": " + item.skills[i]
        }
    }
}
*/


namespace buildings {

export const coal_mine: building_definition = {
    name: "Coal Mine",
    production: new_supply(
        commodity.coal, 1, quality.common, [
            new_demand(commodity.coal_source, RESOURCE_DRAIN_PER_TICK, quality.common),
            new_demand(commodity.raw_labour, 1, quality.common)
        ]
    ),
    tools: [
        new_demand(commodity.pickaxe, 1, quality.common)
    ],
    cost: [
        new_demand(commodity.pickaxe, 1, quality.common)
    ],
}

export const ore_mine: building_definition = {
    name: "Ore Mine",
    production: new_supply(
        commodity.ore, 1, quality.common, [
            new_demand(commodity.ore_source, RESOURCE_DRAIN_PER_TICK, quality.common),
            new_demand(commodity.raw_labour, 1, quality.common)
        ]
    ),
    tools: [
        new_demand(commodity.pickaxe, 1, quality.common)
    ],
    cost: [
        new_demand(commodity.pickaxe, 1, quality.common)
    ],
}

/*

export const smelter: building_definition = {
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
        {commodity: commodity.bricks, amount: 2},
    ],
    strength_multiplier: 1,
    vitality_multiplier: 0,
    magic_multiplier: 1,
    fluids_multiplier: 0,
    skill: skills.smelting
}

export const magesmith : building_definition = {
    name: "Magesmith",
    inputs: [
        {commodity: commodity.essence, amount: 1},
        {commodity: commodity.ingot, amount: 1}
    ],
    tools: [
        {commodity: commodity.magic_tools, amount: 1}
    ],
    outputs: [
        {commodity: commodity.magic_tools, amount: 1}
    ],
    cost: [
        {commodity: commodity.anvil, amount: 2},
        {commodity: commodity.urban_land, amount: 1}
    ],
    strength_multiplier: 0,
    vitality_multiplier: 0,
    magic_multiplier: 1,
    fluids_multiplier: 0,
    skill: skills.magesmith
}

export const well: building_definition = {
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
    fluids_multiplier: 0,
    skill: skills.movement
}

export const blood_extractor: building_definition = {
    name: "Blood Extractor",
    inputs: [
    ],
    tools: [
        {commodity: commodity.magic_tools, amount: 1}
    ],
    outputs: [
        {commodity: commodity.blood, amount: 1}
    ],
    cost: [
        {commodity: commodity.magic_tools, amount: 1},
        {commodity: commodity.urban_land, amount: 1}
    ],
    strength_multiplier: 0,
    vitality_multiplier: 1,
    magic_multiplier: 0,
    fluids_multiplier: 0,
    skill: skills.movement
}

export const blender: building_definition = {
    name: "Blender",
    inputs: [
        {commodity: commodity.corpses, amount: 1}
    ],
    tools: [
        {commodity: commodity.magic_tools, amount: 1}
    ],
    outputs: [
        {commodity: commodity.blood, amount: 10}
    ],
    cost: [
        {commodity: commodity.magic_tools, amount: 1},
        {commodity: commodity.urban_land, amount: 1}
    ],
    strength_multiplier: 1,
    vitality_multiplier: 0,
    magic_multiplier: 0,
    fluids_multiplier: 0,
    skill: skills.movement
}

export const hunting_0: building_definition = {
    name: "Hunting Grounds",
    inputs: [
    ],
    tools: [
        {commodity: commodity.weapons, amount: 1}
    ],
    outputs: [
        {commodity: commodity.corpses, amount: 1}
    ],
    cost: [
        {commodity: commodity.weapons, amount: 1},
        {commodity: commodity.rural_land, amount: 1}
    ],
    strength_multiplier: 1,
    vitality_multiplier: 0,
    magic_multiplier: 1,
    fluids_multiplier: 0,
    skill: skills.hunting
}

export const hunting_1: building_definition = {
    name: "Enchanted Hunting Grounds",
    inputs: [
    ],
    tools: [
        {commodity: commodity.enchanted_weapons, amount: 1}
    ],
    outputs: [
        {commodity: commodity.corpses, amount: 2}
    ],
    cost: [
        {commodity: commodity.enchanted_weapons, amount: 1},
        {commodity: commodity.rural_land, amount: 1}
    ],
    strength_multiplier: 1,
    vitality_multiplier: 0,
    magic_multiplier: 1,
    fluids_multiplier: 0,
    skill: skills.hunting
}

export const essence_mixer: building_definition = {
    name: "Essence Mixer",
    inputs: [
        {commodity: commodity.water, amount: 1},
        {commodity: commodity.blood, amount: 1},
        {commodity: commodity.fluids, amount: 1}
    ],
    tools: [
        {commodity: commodity.magic_tools, amount: 1}
    ],
    outputs: [
        {commodity: commodity.essence, amount: 1}
    ],
    cost: [
        {commodity: commodity.magic_tools, amount: 1},
        {commodity: commodity.urban_land, amount: 1}
    ],
    strength_multiplier: 0,
    vitality_multiplier: 0,
    magic_multiplier: 1,
    fluids_multiplier: 0,
    skill: skills.enchanting
}

export const condensor: building_definition = {
    name: "Magic Condensor",
    inputs: [
        {commodity: commodity.water, amount: 1},
        {commodity: commodity.essence, amount: 1}
    ],
    tools: [
        {commodity: commodity.magic_tools, amount: 1}
    ],
    outputs: [
        {commodity: commodity.magic_crystals, amount: 1}
    ],
    cost: [
        {commodity: commodity.magic_tools, amount: 1},
        {commodity: commodity.urban_land, amount: 1}
    ],
    strength_multiplier: 0,
    vitality_multiplier: 0,
    magic_multiplier: 1,
    fluids_multiplier: 0,
    skill: skills.enchanting
}

export const fluids_extractor: building_definition = {
    name: "Fluids Extractor",
    inputs: [
        {commodity: commodity.water, amount: 1}
    ],
    tools: [
    ],
    outputs: [
        {commodity: commodity.fluids, amount: 1}
    ],
    cost: [
        {commodity: commodity.magic_tools, amount: 1},
        {commodity: commodity.urban_land, amount: 1}
    ],
    strength_multiplier: 0,
    vitality_multiplier: 0,
    magic_multiplier: 0,
    fluids_multiplier: 1,
    skill: skills.movement
}

export const weaponsmith: building_definition = {
    name: "Weaponsmith",
    inputs: [
        {commodity: commodity.ingot, amount: 1}
    ],
    tools: [
        {commodity: commodity.anvil, amount: 1}
    ],
    outputs: [
        {commodity: commodity.weapons, amount: 1}
    ],
    cost: [
        {commodity: commodity.anvil, amount: 1},
        {commodity: commodity.urban_land, amount: 1}
    ],
    strength_multiplier: 1,
    vitality_multiplier: 0,
    magic_multiplier: 0,
    fluids_multiplier: 0,
    skill: skills.smith
}

export const enchanting: building_definition = {
    name: "Enchancing Shop",
    inputs: [
        {commodity: commodity.weapons, amount: 1},
        {commodity: commodity.essence, amount: 1}
    ],
    tools: [
        {commodity: commodity.magic_tools, amount: 1}
    ],
    outputs: [
        {commodity: commodity.enchanted_weapons, amount: 1}
    ],
    cost: [
        {commodity: commodity.magic_tools, amount: 1},
        {commodity: commodity.urban_land, amount: 1}
    ],
    strength_multiplier: 0,
    vitality_multiplier: 0,
    magic_multiplier: 1,
    fluids_multiplier: 0,
    skill: skills.enchanting
}
*/
}

/*
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
*/

new_building(player_index, buildings.ore_mine)

function build_new_building(def: building_definition): number|undefined {
    return new_building(player_index, def)
}

function div_building_definition(def: building_definition) {
    let frame = document.createElement("div")
    let label = document.createElement("div")
    label.innerHTML = def.name

    frame.appendChild(label)

    frame.appendChild(div_supply("Production:", def.production))
    for (let item of def.tools) {
        frame.appendChild(div_demand("Tools", item))
    }

    // frame.appendChild(div_commodity_set("Cost", def.cost))

    let button = document.createElement("div")
    button.classList.add("button")
    button.innerText = "Build"
    button.onclick = (() => {build_new_building(def); update_property_list()});
    frame.appendChild(button)

    return frame
}

function update() {
    update_contracts()

    for (let i = 0; i < contracts.length; i++) {
        update_all_contract_volume_labels(i)
        let actual_contract = contracts[i]
        let supply = supply_data[actual_contract.seller]
        let demand = demand_data[actual_contract.customer]

        let transaction_volume = 0.1
        if (supply.inventory < transaction_volume) {
            transaction_volume = supply.inventory
        }
        if (actual_contract.expected_volume != undefined) {
            if (actual_contract.expected_volume < transaction_volume) {
                transaction_volume = actual_contract.expected_volume
            }
        }
        if (actual_contract.expected_volume != undefined) {
            actual_contract.expected_volume -= transaction_volume
        }
        demand.inventory += transaction_volume
        supply.inventory -= transaction_volume
        characters[actual_contract.seller_character].currency_storage[actual_contract.currency] += actual_contract.negotiated_price * transaction_volume
        characters[actual_contract.customer_character].currency_storage[actual_contract.currency] -= actual_contract.negotiated_price * transaction_volume
    }

    update_all_inventory_labels_demand()
    update_all_inventory_labels_supply()

    for (let supply of supply_data) {
        supply.inventory -= supply.inventory * commodity_definition[supply.commodity].decay
    }
    for (let supply of supply_data) {
        let inputs_available = 1
        for (let demand_index of supply.inputs) {
            let item = demand_data[demand_index]
            inputs_available = Math.min(inputs_available, item.inventory / item.amount)
        }

        for (let demand_index of supply.inputs) {
            let item = demand_data[demand_index]
            item.inventory -= item.amount * inputs_available
            item.inventory -= item.inventory * commodity_definition[item.commodity].decay
        }
        supply.inventory += supply.amount * inputs_available
    }
    for (let conversion of convert_to_currency) {
        let data = supply_data[conversion]
        let player = characters[player_index]
        player.currency_storage[data.commodity] += data.inventory
        data.inventory = 0
    }

    for (let character of characters) {
        for (let currency = 0; currency < commodity.total; currency ++) {
            for (let supply_index of character.base_supply) {
                let supply = supply_data[supply_index]
                // update lord prices
                let manufacture_cost = 0
                for (let demand_index of supply.inputs) {
                    let item = demand_data[demand_index]
                    manufacture_cost += item.amount * get_price(character.conversion_rate, item.commodity, currency)
                }

                let old_price = get_price(character.conversion_rate, supply.commodity, currency)

                set_price(character.conversion_rate, supply.commodity, currency, manufacture_cost * 1.5)
                changed_supply_prices.set(supply_index, true)
            }
        }
    }

    // local_supply.fill(100, 0, commodity.total)
    //decay inventory and set baseline demand/supply:
    // for (let i = 0; i < commodity.total; i++) {
    //     if (i == commodity.magic_crystals) {
    //         continue;
    //     }
    //     let decay = commodity_definition[i].decay * inventory[i]
    //     inventory[i] -= decay
    //     inventory[i] = Math.max(0, inventory[i])
    // }
    // for (let i = 0; i < commodity.total; i++) {
    //     local_demand[i] = commodity_definition[i].base_spendings / price[i]
    // }

    // for (let item of base_production) {
    //     let profit_estimation = 0
    //     for (let input of item.def.inputs) {
    //         profit_estimation = profit_estimation - input.amount * price[input.commodity]
    //     }
    //     for (let output of item.def.outputs) {
    //         profit_estimation = profit_estimation + output.amount * price[output.commodity]
    //     }

    //     item.scale += profit_estimation

    //     item.scale = Math.min(item.scale, 100)
    //     item.scale = Math.max(item.scale, 0)
    // }

    // for (let item of base_production) {
    //     for (let input of item.def.inputs) {
    //         local_demand[input.commodity] += input.amount * item.scale
    //     }
    //     for (let input of item.def.tools) {
    //         local_demand[input.commodity] += input.amount * 0.1
    //     }
    //     for (let output of item.def.outputs) {
    //         local_supply[output.commodity] += output.amount * item.scale
    //     }
    // }

}



function update_property_list() {
    let connect_button = document.getElementById("self-contract")
    if (connect_button == undefined) {
        alert("No supply-demand button")
        return
    }
    connect_button.onclick = () => {
        if (selected_supply == undefined) {
            alert("select supply")
            return
        }
        if (selected_demand == undefined) {
            alert("select demand")
            return
        }
        new_contract(
            selected_supply, player_index, selected_demand, player_index, 0, commodity.essence, false
        )
    }

    let frame = document.getElementById("property-frame")
    if (frame == undefined) {
        alert("No property frame")
        return;
    }

    frame.innerHTML = "";
    let property = owner_to_buildings.get(player_index)
    if (property == undefined) {{
        return
    }}

    for (let item of property) {
        let row = document.createElement("div");
        let building = buildings_data[item]
        row.innerHTML = building.definition.name + " ID:" + item
        let hire_button = document.createElement("div");
        hire_button.classList.add("button")
        hire_button.innerHTML = "Hire selected worker in this building"
        hire_button.onclick = () => {
            // employ(selected_worker, item);
            update_property_list();
        }
        row.appendChild(hire_button)

        // let image_div: HTMLImageElement|undefined = undefined
        // let worker_div = document.createElement("div")
        // if (building_to_worker.has(item.id)) {
        //     worker_div.innerHTML = "Worker: " + building_to_worker.get(item.id)!.name
        //     image_div = document.createElement("img");
        //     image_div.src = building_to_worker.get(item.id)!.portrait
        // } else {
        //     worker_div.innerHTML = "Worker: None"
        // }
        // row.appendChild(worker_div)
        // if (image_div) row.appendChild(image_div)

        frame.appendChild(row)
    }
}


window.onload = () => {

    update_player_supply_and_demand()
    init_inventory_frame(characters[player_index])
    update_workers_list()
    update_property_list()
    update_lords_frame()

    {
        let frame = document.getElementById("control-frame")
        if (frame == undefined) {
            alert("No control frame")
            return;
        }

        frame.appendChild(div_building_definition(buildings.ore_mine));
        frame.appendChild(div_building_definition(buildings.coal_mine));
        // frame.appendChild(div_building_definition(buildings.smelter));
        // frame.appendChild(div_building_definition(buildings.magesmith));
        // frame.appendChild(div_building_definition(buildings.well));
        // frame.appendChild(div_building_definition(buildings.condensor));
        // frame.appendChild(div_building_definition(buildings.blender));
        // frame.appendChild(div_building_definition(buildings.blood_extractor));
        // frame.appendChild(div_building_definition(buildings.essence_mixer));
        // frame.appendChild(div_building_definition(buildings.fluids_extractor));
        // frame.appendChild(div_building_definition(buildings.hunting_0));
        // frame.appendChild(div_building_definition(buildings.hunting_1));
        // frame.appendChild(div_building_definition(buildings.weaponsmith));
        // frame.appendChild(div_building_definition(buildings.enchanting));
    }

    // document.getElementById("gacha-button")!.onclick = pull_daemon_characters

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

