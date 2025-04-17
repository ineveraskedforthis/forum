var new_div = function () { return document.createElement("div"); };
var new_label = function (label) { var d = document.createElement("div"); d.innerHTML = label; return d; };
function new_button(label, callback) {
    var d = document.createElement("div");
    d.innerHTML = label;
    d.onclick = callback;
    d.classList.add("button");
    return d;
}
function new_contract_volume_label(contract) {
    var _a;
    var d = document.createElement("div");
    d.innerHTML = "Remaining volume: " + ((_a = contracts[contract].expected_volume) === null || _a === void 0 ? void 0 : _a.toFixed(2));
    d.classList.add("contract" + contract + "volume");
    return d;
}
function update_all_contract_volume_labels(contract) {
    var query_result = document.querySelectorAll(".contract" + contract + "volume");
    query_result.forEach(function (value, i, p) {
        var _a;
        value.innerHTML = "Remaining volume: " + ((_a = contracts[contract].expected_volume) === null || _a === void 0 ? void 0 : _a.toFixed(2));
    });
}
var commodity;
(function (commodity) {
    commodity.coins = 0;
    commodity.fluids = 1;
    commodity.blood = 2;
    commodity.water = 3;
    commodity.weapons = 4;
    commodity.enchanted_weapons = 5;
    commodity.magic_crystals = 6;
    commodity.ore = 7;
    commodity.ingot = 8;
    commodity.coal = 9;
    commodity.anvil = 10;
    commodity.pickaxe = 11;
    commodity.shovel = 12;
    commodity.magic_tools = 13;
    commodity.bricks = 14;
    commodity.clay = 15;
    commodity.corpses = 16;
    commodity.essence = 17;
    commodity.ore_source = 18;
    commodity.coal_source = 19;
    commodity.rural_land = 20;
    commodity.urban_land = 21;
    commodity.total = 22;
})(commodity || (commodity = {}));
var commodity_definition = [];
commodity_definition[commodity.coins] = {
    name: "Coins",
    decay: 0,
};
commodity_definition[commodity.fluids] = {
    name: "Fluids",
    decay: 0.1,
};
commodity_definition[commodity.blood] = {
    name: "Blood",
    decay: 0.1,
};
commodity_definition[commodity.water] = {
    name: "Water",
    decay: 0,
};
commodity_definition[commodity.weapons] = {
    name: "Weapons",
    decay: 0,
};
commodity_definition[commodity.enchanted_weapons] = {
    name: "Enchanted Weapons",
    decay: 0,
};
commodity_definition[commodity.magic_crystals] = {
    name: "Magic crystals",
    decay: 0,
};
commodity_definition[commodity.ore] = {
    name: "Ore",
    decay: 0,
};
commodity_definition[commodity.ingot] = {
    name: "Ingots",
    decay: 0,
};
commodity_definition[commodity.coal] = {
    name: "Coal",
    decay: 0,
};
commodity_definition[commodity.anvil] = {
    name: "Anvil",
    decay: 0,
};
commodity_definition[commodity.pickaxe] = {
    name: "Pickaxe",
    decay: 0,
};
commodity_definition[commodity.shovel] = {
    name: "Shovel",
    decay: 0,
};
commodity_definition[commodity.magic_tools] = {
    name: "Magic Tools",
    decay: 0,
};
commodity_definition[commodity.bricks] = {
    name: "Bricks",
    decay: 0,
};
commodity_definition[commodity.clay] = {
    name: "Clay",
    decay: 0,
};
commodity_definition[commodity.corpses] = {
    name: "Corpses",
    decay: 0.1
};
commodity_definition[commodity.essence] = {
    name: "Essence",
    decay: 0
};
commodity_definition[commodity.ore_source] = {
    name: "Ore Source",
    decay: 0
};
commodity_definition[commodity.coal_source] = {
    name: "Coal Source",
    decay: 0
};
commodity_definition[commodity.rural_land] = {
    name: "Rural Land Plot",
    decay: 0
};
commodity_definition[commodity.urban_land] = {
    name: "Urban Land Plot",
    decay: 0
};
var inventory = [];
var trade = [];
var price_sell = [];
var price_buy = [];
// const local_supply: number[] = []
// const local_demand: number[] = []
/*
const exchange_matrix: number[] = []
exchange_matrix.length = commodity.total * commodity.total
exchange_matrix.fill(0, 0, commodity.total * commodity.total)

// we can sell `commodity` for `effective_price` `monetary_commodity`
// which means that this good
function update_exchange_matrix(priced_commodity: number, monetary_commodity: number, effective_price: number) {
    let index = priced_commodity * commodity.total + monetary_commodity
    exchange_matrix[index] = Math.max(exchange_matrix[index] )
}
*/
inventory.length = commodity.total;
trade.length = commodity.total;
price_sell.length = commodity.total;
price_buy.length = commodity.total;
// local_supply.length = commodity.total
// local_demand.length = commodity.total
inventory.fill(0, 0, commodity.total);
trade.fill(0, 0, commodity.total);
price_sell.fill(0, 0, commodity.total);
var MAX_PRICE = 100000;
var DIRECT_PROCUREMENT_PRICE_MULTIPLIER = 10;
price_buy.fill(MAX_PRICE, 0, commodity.total);
var RESOURCE_DRAIN_PER_TICK = 0.0001;
price_sell[commodity.coins] = 1;
price_buy[commodity.coins] = 1;
inventory[commodity.ore_source] = 2;
function trade_change(i, x) {
    return function () { return trade[i] += x; };
}
function init_inventory_frame() {
    var frame = document.getElementById("inventory-frame");
    if (frame == undefined) {
        alert("No inventory frame");
        return;
    }
    frame.innerHTML = "";
    for (var i = 0; i < commodity.total; i++) {
        var item = document.createElement("div");
        item.classList.add("row");
        var label = document.createElement("div");
        label.innerHTML = commodity_definition[i].name;
        var have = document.createElement("div");
        have.id = "inv" + i;
        have.innerHTML = "Have: " + inventory[i].toFixed(2);
        // let trade_div = document.createElement("div")
        // trade_div.id = "trade" + i
        // trade_div.innerHTML = "Trade: " + trade[i].toFixed(2)
        // let button_increase_trade = document.createElement("div");
        // button_increase_trade.classList.add("button")
        // button_increase_trade.innerHTML = "Buy more";
        // button_increase_trade.onclick = trade_change(i, 0.1)
        // let button_decrease_trade = document.createElement("div");
        // button_decrease_trade.classList.add("button")
        // button_decrease_trade.innerHTML = "Sell more";
        // button_decrease_trade.onclick = trade_change(i, -0.1)
        // let price_sell_div = document.createElement("div")
        // price_sell_div.id = "price_sell" + i
        // price_sell_div.innerHTML = "Sell Price: " + price_sell[i].toFixed(2)
        // let price_buy_div = document.createElement("div")
        // price_buy_div.id = "price_buy" + i
        // price_buy_div.innerHTML = "Buy Price: " + price_buy[i].toFixed(2)
        frame.appendChild(item);
        item.appendChild(label);
        item.appendChild(have);
        // item.appendChild(button_increase_trade)
        // item.appendChild(trade_div)
        // item.appendChild(button_decrease_trade)
        // item.appendChild(price_sell_div)
        // item.appendChild(price_buy_div)
    }
}
function update_inventory_frame() {
    for (var i = 0; i < commodity.total; i++) {
        var have = document.getElementById("inv" + i);
        have.innerHTML = "Have: " + inventory[i].toFixed(2);
        // let trade_div = document.getElementById("trade" + i)!
        // trade_div.innerHTML = "Trade: " + trade[i].toFixed(2)
        // let price_buy_div = document.getElementById("price_buy" + i)!
        // price_buy_div.innerHTML = "Buy Price: " + price_buy[i].toFixed(2)
        // let price_sell_div = document.getElementById("price_sell" + i)!
        // price_sell_div.innerHTML = "Sell Price: " + price_sell[i].toFixed(2)
    }
}
function div_commodity_set(label, set) {
    var frame = new_div();
    var label_div = new_div();
    label_div.innerHTML = label;
    frame.appendChild(label_div);
    for (var _i = 0, set_1 = set; _i < set_1.length; _i++) {
        var item = set_1[_i];
        var item_div = new_div();
        item_div.classList.add("row");
        var name_div = new_div();
        var count_div = new_div();
        name_div.innerHTML = commodity_definition[item.commodity].name;
        count_div.innerHTML = item.amount.toString();
        item_div.appendChild(name_div);
        item_div.appendChild(count_div);
        frame.appendChild(item_div);
    }
    return frame;
}
var skills;
(function (skills) {
    skills.mining = 0;
    skills.enchanting = 1;
    skills.smelting = 2;
    skills.smith = 3;
    skills.magesmith = 4;
    skills.movement = 5;
    skills.hunting = 6;
    skills.total = 7;
})(skills || (skills = {}));
var skill_names = {};
skill_names[skills.mining] = "mining";
skill_names[skills.enchanting] = "enchanting";
skill_names[skills.smelting] = "smelting";
skill_names[skills.smith] = "smith";
skill_names[skills.magesmith] = "magesmith";
skill_names[skills.movement] = "movement";
skill_names[skills.hunting] = "hunting";
function base_skill() {
    var result = [];
    result.length = skills.total;
    result.fill(0, 0, skills.total);
    return result;
}
var demand_data = [];
function new_demand(commodity, price, amount, player) {
    demand_data.push({
        commodity: commodity,
        price: price,
        amount: amount,
        inventory: 0,
        contracted: false,
        player: player
    });
    return demand_data.length - 1;
}
var supply_data = [];
function new_supply(commodity, price, amount, inputs, starting_amount, player) {
    if (starting_amount == undefined) {
        starting_amount = 0;
    }
    supply_data.push({
        commodity: commodity,
        price: price,
        amount: amount,
        inventory: starting_amount,
        contracted: false,
        inputs: inputs,
        player: player
    });
    return supply_data.length - 1;
}
var contracts = [];
var smelting_lord = {
    id: 1,
    name: "The Smelter",
    portrait: "../images/smelter.png",
    monetary_preference: commodity.essence,
    production: [
        new_supply(commodity.ingot, 10, 2, [
            new_demand(commodity.ore, 10, 1), new_demand(commodity.coal, 6, 1)
        ])
    ],
    base_demand: [],
};
var main_smelter_ingots = smelting_lord.production[0];
var main_smelter_ore_input = supply_data[main_smelter_ingots].inputs[0];
var main_smelter_coal_input = supply_data[main_smelter_ingots].inputs[1];
var smith_lord = {
    id: 2,
    name: "The Smith",
    portrait: "../images/smith.png",
    monetary_preference: commodity.essence,
    production: [
        new_supply(commodity.pickaxe, 50, 2, [
            new_demand(commodity.ingot, 15, 1)
        ])
    ],
    base_demand: [],
};
var main_blacksmith_pickaxe = smith_lord.production[0];
var main_blacksmith_ingots_input = supply_data[main_blacksmith_pickaxe].inputs[0];
var crystal_lord = {
    id: 3,
    name: "The Crystal Dealer",
    portrait: "../images/crystal.png",
    monetary_preference: commodity.ore,
    production: [
        new_supply(commodity.magic_crystals, 1, 1, [
            new_demand(commodity.essence, 0.1, 1)
        ])
    ],
    base_demand: [],
};
var crystal_lord_production = crystal_lord.production[0];
var crystal_lord_essence_inputs = supply_data[crystal_lord_production].inputs[0];
var land_lord_0 = {
    id: 4,
    name: "The Mayor",
    portrait: "../images/landlord_0.png",
    monetary_preference: commodity.essence,
    production: [],
    base_demand: [],
    special_deal: [
        new_supply(commodity.urban_land, 1000, 2, [], 1000),
        new_supply(commodity.coal_source, 1000, 2, [], 1000),
        new_supply(commodity.ore_source, 1000, 2, [], 1000),
    ]
};
var merchant_lord = {
    id: 4,
    name: "The Merchant",
    portrait: "../images/merchant.png",
    monetary_preference: commodity.essence,
    production: [
        new_supply(commodity.coal, 1, 2, [], 1000),
        new_supply(commodity.ore, 1, 2, [], 1000),
        new_supply(commodity.water, 1, 2, [], 1000),
    ],
    base_demand: [],
    special_deal: []
};
var coal_source = merchant_lord.production[0];
var ore_source = merchant_lord.production[1];
var water_source = merchant_lord.production[2];
function new_non_player_contract(seller, customer, negotiated_price) {
    contracts.push({
        seller: seller,
        customer: customer,
        active: true,
        negotiated_price: negotiated_price,
        expected_volume: undefined,
        base_expected_volume: 0,
        locked_currency: 0
    });
    var demand = demand_data[customer];
    demand.price = (demand.price + negotiated_price) / 2;
}
function renegotiate_price_non_player_contract(contract) {
    var supply = supply_data[contract.seller];
    var demand = demand_data[contract.customer];
    var negotiated_price = (supply.price + demand.price) / 2;
    demand.price = (demand.price + negotiated_price) / 2;
}
var changed_supply_prices = new Map;
function update_contracts() {
    var changed = false;
    for (var _i = 0, contracts_1 = contracts; _i < contracts_1.length; _i++) {
        var contract = contracts_1[_i];
        if (supply_data[contract.customer].player) {
            continue;
        }
        if (changed_supply_prices.has(contract.seller)) {
            renegotiate_price_non_player_contract(contract);
            changed = true;
        }
    }
    changed_supply_prices.clear();
    if (changed) {
        var lords_frame = document.getElementById("lords-frame");
        lords_frame.innerHTML = "";
        for (var _a = 0, known_lords_1 = known_lords; _a < known_lords_1.length; _a++) {
            var lord = known_lords_1[_a];
            lords_frame.appendChild(make_lord_div(lord));
        }
    }
}
// establish starting links
{
    new_non_player_contract(main_smelter_ingots, main_blacksmith_ingots_input, 12);
    new_non_player_contract(coal_source, main_smelter_coal_input, 2);
    new_non_player_contract(ore_source, main_smelter_coal_input, 5);
}
function buy_from_supply(item, x, monetary_commodity) {
    if (item.inventory < x) {
        x = item.inventory;
    }
    if (inventory[monetary_commodity] < x * item.price * DIRECT_PROCUREMENT_PRICE_MULTIPLIER) {
        x = inventory[monetary_commodity] / item.price / DIRECT_PROCUREMENT_PRICE_MULTIPLIER;
    }
    item.inventory -= x;
    inventory[item.commodity] += x;
    inventory[monetary_commodity] -= x * item.price * DIRECT_PROCUREMENT_PRICE_MULTIPLIER;
}
function buy_from_supply_callback(item, x, monetary_commodity) {
    return function () {
        buy_from_supply(item, x, monetary_commodity);
    };
}
function sell_to_demand(item, x, monetary_commodity) {
    if (item.inventory > 10) {
        return;
    }
    if (inventory[item.commodity] < x) {
        x = inventory[item.commodity];
    }
    item.inventory += x;
    inventory[item.commodity] -= x;
    inventory[monetary_commodity] += x * item.price / DIRECT_PROCUREMENT_PRICE_MULTIPLIER;
}
function sell_to_demand_callback(item, x, monetary_commodity) {
    return function () {
        sell_to_demand(item, x, monetary_commodity);
    };
}
function negotiate_contract_callback(item) {
    return function () { item.contracted = true; };
}
function cancel_contract_callback(item) {
    return function () { item.contracted = false; };
}
var player_contracts = [];
function create_supply_player_contract(lord, supply_index, volume, price, upfront) {
    var locked = 0;
    if (upfront) {
        locked = volume * price;
    }
    if (inventory[lord.monetary_preference] < locked) {
        alert("Not enough currency. Requires ".concat(locked, " ").concat(commodity_definition[lord.monetary_preference].name));
        return;
    }
    inventory[lord.monetary_preference] -= locked;
    var supply = supply_data[supply_index];
    // new demand of special type as player is not a lord
    var demand = new_demand(supply.commodity, 0, 1, true);
    // negotiate a new contract
    var new_contract = {
        seller: supply_index,
        customer: demand,
        negotiated_price: price,
        locked_currency: locked,
        expected_volume: volume,
        base_expected_volume: volume,
        active: true,
    };
    contracts.push(new_contract);
    var new_player_contract = {
        contract_id: contracts.length - 1,
        target_lord: lord
    };
    player_contracts.push(new_player_contract);
    start_supply_negotiation(lord, supply_index);
}
function create_supply_player_contract_callback(lord, supply_index, volume, price, upfront) {
    return function () { create_supply_player_contract(lord, supply_index, volume, price, upfront); };
}
function create_demand_player_contract(lord, demand_index, volume, price) {
    var demand = demand_data[demand_index];
    // new demand of special type as player is not a lord
    var supply_index = new_supply(demand.commodity, 0, 1, [], 0, true);
    // negotiate a new contract
    var new_contract = {
        seller: supply_index,
        customer: demand_index,
        negotiated_price: price,
        locked_currency: 0,
        expected_volume: volume,
        base_expected_volume: volume,
        active: true,
    };
    contracts.push(new_contract);
    var new_player_contract = {
        contract_id: contracts.length - 1,
        target_lord: lord
    };
    player_contracts.push(new_player_contract);
    start_demand_negotiation(lord, demand_index);
}
function create_demand_player_contract_callback(lord, supply_index, volume, price) {
    return function () { create_demand_player_contract(lord, supply_index, volume, price); };
}
function price_multiplier(volume, upfront) {
    var base = 1.1;
    if (upfront) {
        base = 1.01;
    }
    var log2 = Math.floor(Math.log2(volume) + 0.5);
    return base * Math.max(1, 2 - log2 / 10);
}
function start_supply_negotiation(lord, supply_index) {
    var frame = document.createElement("div");
    var supply = supply_data[supply_index];
    var commodity = commodity_definition[supply.commodity];
    var top_frame = document.createElement("div");
    top_frame.classList.add("negotiation-grid");
    var description_frame = document.createElement("div");
    description_frame.appendChild(new_label("Negotiations with " + lord.name));
    description_frame.appendChild(new_label("On topic of"));
    description_frame.appendChild(new_label("Procurement of " + commodity.name));
    description_frame.appendChild(new_label("Buyer: (You)"));
    description_frame.appendChild(new_label("Seller: " + lord.name));
    var portrait_frame = document.createElement("div");
    var img = document.createElement("img");
    img.src = lord.portrait;
    portrait_frame.appendChild(img);
    top_frame.appendChild(description_frame);
    top_frame.appendChild(portrait_frame);
    frame.appendChild(top_frame);
    var details_frame = document.createElement("div");
    // look for existing contract:
    var contract = undefined;
    for (var _i = 0, player_contracts_1 = player_contracts; _i < player_contracts_1.length; _i++) {
        var item = player_contracts_1[_i];
        var contract_details = contracts[item.contract_id];
        if (contract_details.seller == supply_index) {
            contract = item;
        }
    }
    if (contract == undefined) {
        details_frame.appendChild(new_label("Currently, you have no contracts active"));
        details_frame.appendChild(new_label("".concat(lord.name, " suggests the following options:")));
        var volumes = [5, 200, 1000];
        var upfront = [false, true];
        var currency = lord.monetary_preference;
        var currency_name = commodity_definition[currency].name;
        for (var _a = 0, upfront_1 = upfront; _a < upfront_1.length; _a++) {
            var flag = upfront_1[_a];
            for (var _b = 0, volumes_1 = volumes; _b < volumes_1.length; _b++) {
                var volume = volumes_1[_b];
                var price = supply.price * price_multiplier(volume, flag);
                var adjective = "continuous";
                if (flag) {
                    adjective = "upfront";
                }
                details_frame.appendChild(new_button("Negotiate procurement of ".concat(volume, " units with ").concat(adjective, " cost of ").concat((price * volume).toFixed(2), " ").concat(currency_name), create_supply_player_contract_callback(lord, supply_index, volume, price, flag)));
            }
        }
    }
    else {
        var details_1 = contracts[contract.contract_id];
        var supply_1 = supply_data[details_1.seller];
        details_frame.appendChild(new_label("You have negotiated to procure ".concat(commodity.name, " with price equal to ").concat(contracts[contract.contract_id].negotiated_price, " ").concat(commodity_definition[lord.monetary_preference].name, " per unit")));
        details_frame.appendChild(new_contract_volume_label(contract.contract_id));
        details_frame.appendChild(new_button("Negotiate a lower price", function () {
            var new_price = supply_1.price * price_multiplier(details_1.base_expected_volume, false);
            if (supply_1.price < details_1.negotiated_price) {
                details_1.negotiated_price = new_price;
            }
        }));
        var volume_1 = details_1.expected_volume;
        if (volume_1 != undefined) {
            details_frame.appendChild(new_button("Extend contract ".concat(details_1.base_expected_volume), function () {
                details_1.expected_volume = volume_1 + details_1.base_expected_volume;
            }));
        }
    }
    frame.appendChild(details_frame);
    var negotiation_frame = document.getElementById("negotiation");
    if (negotiation_frame == undefined) {
        alert("no negotiation div");
        return;
    }
    negotiation_frame.innerHTML = "";
    negotiation_frame.appendChild(frame);
}
function start_supply_negotiation_callback(lord, supply_index) {
    return function () { start_supply_negotiation(lord, supply_index); };
}
function start_demand_negotiation(lord, demand_index) {
    var frame = document.createElement("div");
    var demand = demand_data[demand_index];
    var commodity = commodity_definition[demand.commodity];
    var top_frame = document.createElement("div");
    top_frame.classList.add("negotiation-grid");
    var description_frame = document.createElement("div");
    description_frame.appendChild(new_label("Negotiations with " + lord.name));
    description_frame.appendChild(new_label("On topic of"));
    description_frame.appendChild(new_label("Procurement of " + commodity.name));
    description_frame.appendChild(new_label("Buyer: " + lord.name));
    description_frame.appendChild(new_label("Seller: (You)"));
    var portrait_frame = document.createElement("div");
    var img = document.createElement("img");
    img.src = lord.portrait;
    portrait_frame.appendChild(img);
    top_frame.appendChild(description_frame);
    top_frame.appendChild(portrait_frame);
    frame.appendChild(top_frame);
    var details_frame = document.createElement("div");
    // look for existing contract:
    var contract = undefined;
    for (var _i = 0, player_contracts_2 = player_contracts; _i < player_contracts_2.length; _i++) {
        var item = player_contracts_2[_i];
        var contract_details = contracts[item.contract_id];
        if (contract_details.customer == demand_index) {
            contract = item;
        }
    }
    if (contract == undefined) {
        details_frame.appendChild(new_label("Currently, you have no contracts active"));
        details_frame.appendChild(new_label("".concat(lord.name, " suggests the following options:")));
        var volumes = [5, 200, 1000];
        var currency = lord.monetary_preference;
        var currency_name = commodity_definition[currency].name;
        for (var _a = 0, volumes_2 = volumes; _a < volumes_2.length; _a++) {
            var volume = volumes_2[_a];
            var price = demand.price / price_multiplier(volume, false);
            details_frame.appendChild(new_button("Negotiate procurement of ".concat(volume, " units with continuous cost of ").concat((price * volume).toFixed(2), " ").concat(currency_name), create_demand_player_contract_callback(lord, demand_index, volume, price)));
        }
    }
    else {
        var details_2 = contracts[contract.contract_id];
        var demand_1 = demand_data[details_2.customer];
        details_frame.appendChild(new_label("You have negotiated to provide ".concat(commodity.name, " with price equal to ").concat(contracts[contract.contract_id].negotiated_price.toFixed(2), " ").concat(commodity_definition[lord.monetary_preference].name, " per unit")));
        details_frame.appendChild(new_contract_volume_label(contract.contract_id));
        details_frame.appendChild(new_button("Negotiate a higher price", function () {
            var new_price = demand_1.price / price_multiplier(details_2.base_expected_volume, false);
            if (demand_1.price < details_2.negotiated_price) {
                details_2.negotiated_price = new_price;
            }
        }));
        var volume_2 = details_2.expected_volume;
        if (volume_2 != undefined) {
            details_frame.appendChild(new_button("Extend contract ".concat(details_2.base_expected_volume), function () {
                details_2.expected_volume = volume_2 + details_2.base_expected_volume;
            }));
        }
    }
    frame.appendChild(details_frame);
    var negotiation_frame = document.getElementById("negotiation");
    if (negotiation_frame == undefined) {
        alert("no negotiation div");
        return;
    }
    negotiation_frame.innerHTML = "";
    negotiation_frame.appendChild(frame);
}
function start_demand_negotiation_callback(lord, demand_index) {
    return function () { start_demand_negotiation(lord, demand_index); };
}
function make_lord_div(item) {
    var frame = document.createElement("div");
    frame.appendChild(new_label(item.name));
    var portrait = document.createElement("img");
    portrait.src = item.portrait;
    frame.appendChild(portrait);
    var deals = item.special_deal;
    if (deals != undefined) {
        for (var _i = 0, deals_1 = deals; _i < deals_1.length; _i++) {
            var supply_index = deals_1[_i];
            var deal = supply_data[supply_index];
            var buy_one = document.createElement("div");
            buy_one.innerHTML = "Buy 1 " + commodity_definition[deal.commodity].name + " for " + deal.price + " " + commodity_definition[item.monetary_preference].name;
            buy_one.classList.add("button");
            buy_one.onclick = buy_from_supply_callback(deal, 1, item.monetary_preference);
            frame.appendChild(buy_one);
        }
    }
    for (var _a = 0, _b = item.production; _a < _b.length; _a++) {
        var method = _b[_a];
        var production_frame = document.createElement("div");
        var supply = supply_data[method];
        {
            production_frame.appendChild(new_button("Negotiate procurement of " + commodity_definition[supply.commodity].name, start_supply_negotiation_callback(item, method)));
            {
                var buy_one = document.createElement("div");
                buy_one.innerHTML = "Buy 1 " + commodity_definition[supply.commodity].name + " for " + (supply.price * DIRECT_PROCUREMENT_PRICE_MULTIPLIER).toFixed(2) + " " + commodity_definition[item.monetary_preference].name;
                buy_one.classList.add("button");
                buy_one.onclick = buy_from_supply_callback(supply, 1, item.monetary_preference);
                production_frame.appendChild(buy_one);
            }
        }
        for (var _c = 0, _d = supply.inputs; _c < _d.length; _c++) {
            var demand_index = _d[_c];
            var demand = demand_data[demand_index];
            {
                production_frame.appendChild(new_button("Negotiate procurement of " + commodity_definition[demand.commodity].name, start_demand_negotiation_callback(item, method)));
            }
            {
                var sell_one = document.createElement("div");
                sell_one.innerHTML = "Sell 1 " + commodity_definition[demand.commodity].name + " for " + (demand.price / DIRECT_PROCUREMENT_PRICE_MULTIPLIER).toFixed(2) + " " + commodity_definition[item.monetary_preference].name;
                sell_one.classList.add("button");
                sell_one.onclick = sell_to_demand_callback(demand, 1, item.monetary_preference);
                production_frame.appendChild(sell_one);
            }
        }
        frame.appendChild(production_frame);
    }
    return frame;
}
var known_lords = [
    smelting_lord, smith_lord, crystal_lord, merchant_lord, land_lord_0
];
var player = {
    id: 0,
    name: "(You)",
    portrait: "../images/player.png",
    strength: 1,
    vitality: 0,
    magic: 1,
    fluids: 0,
    trust: 100,
    desired_wage: 0,
    rarity: 0,
    skills: base_skill()
};
var imp = {
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
};
imp.skills[skills.mining] = 20;
var minor_imp = {
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
};
minor_imp.skills[skills.mining] = 5;
var minor_eyeful = {
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
};
var slime_black = {
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
};
var deel_rub = {
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
};
deel_rub.skills[skills.smelting] = 20;
deel_rub.skills[skills.smith] = 20;
deel_rub.skills[skills.magesmith] = 5;
var deel_sar = {
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
};
deel_sar.skills[skills.smelting] = 20;
deel_sar.skills[skills.smith] = 40;
deel_sar.skills[skills.magesmith] = 5;
var marela = {
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
};
marela.skills[skills.magesmith] = 50;
var imp_major = {
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
};
imp_major.skills[skills.mining] = 50;
imp_major.skills[skills.smith] = 50;
imp_major.skills[skills.smelting] = 50;
var qab_etua = {
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
};
qab_etua.skills[skills.enchanting] = 100;
qab_etua.skills[skills.magesmith] = 100;
var imp_minor = {
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
};
var terrom = {
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
};
terrom.skills[skills.movement] = 50;
terrom.skills[skills.hunting] = 60;
var tersia = {
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
};
tersia.skills[skills.enchanting] = 20;
var terpim = {
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
};
function build_worker_frame(item) {
    var entry = document.createElement("div");
    if (item == selected_worker) {
        entry.classList.add("selected-worker");
    }
    var label = document.createElement("div");
    label.innerHTML = item.name + " ID:" + item.id;
    var select_button = document.createElement("div");
    select_button.innerHTML = "Select";
    select_button.classList.add("button");
    select_button.onclick = function () {
        selected_worker = item;
        update_workers_list();
    };
    var image_div = document.createElement("img");
    image_div.src = item.portrait;
    entry.appendChild(label);
    entry.appendChild(image_div);
    entry.appendChild(new_label("Strength: " + item.strength));
    entry.appendChild(new_label("Vitality: " + item.vitality));
    entry.appendChild(new_label("Magic: " + item.magic));
    entry.appendChild(new_label("Fluids: " + item.fluids));
    for (var i = 0; i < skills.total; i++) {
        var skill_label = new_label(skill_names[i] + ": " + item.skills[i]);
        skill_label.id = "skill_" + i + "_" + item.id;
        entry.appendChild(skill_label);
    }
    entry.appendChild(select_button);
    return entry;
}
var workers = [player];
var selected_worker = player;
var daemons_pool = [
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
];
function new_worker(character) {
    for (var _i = 0, workers_1 = workers; _i < workers_1.length; _i++) {
        var item = workers_1[_i];
        if (item.id == character.id) {
            item.trust += 1;
            return;
        }
    }
    workers.push(character);
}
function pull_daemon_characters() {
    if (inventory[commodity.magic_crystals] < 500) {
        return;
    }
    inventory[commodity.magic_crystals] -= 500;
    var total_weight = 0;
    for (var _i = 0, daemons_pool_1 = daemons_pool; _i < daemons_pool_1.length; _i++) {
        var item = daemons_pool_1[_i];
        total_weight += 1 / item.rarity;
    }
    for (var i = 0; i < 10; i++) {
        var roll = Math.random() * total_weight;
        for (var _a = 0, daemons_pool_2 = daemons_pool; _a < daemons_pool_2.length; _a++) {
            var item = daemons_pool_2[_a];
            roll -= 1 / item.rarity;
            if (roll < 0) {
                new_worker(item);
                document.getElementById("gacha-history").appendChild(new_label(item.name));
                break;
            }
        }
    }
    update_workers_list();
}
function update_workers_list() {
    var frame = document.getElementById("workers-frame");
    if (frame == undefined) {
        alert("No workers frame");
        return;
    }
    frame.innerHTML = "";
    for (var _i = 0, workers_2 = workers; _i < workers_2.length; _i++) {
        var item = workers_2[_i];
        frame.appendChild(build_worker_frame(item));
    }
}
function update_skills() {
    for (var _i = 0, workers_3 = workers; _i < workers_3.length; _i++) {
        var item = workers_3[_i];
        for (var i = 0; i < skills.total; i++) {
            var e = document.getElementById("skill_" + i + "_" + item.id);
            e.innerHTML = skill_names[i] + ": " + item.skills[i];
        }
    }
}
var buildings;
(function (buildings) {
    buildings.coal_mine = {
        name: "Coal Mine",
        inputs: [
            { commodity: commodity.coal_source, amount: RESOURCE_DRAIN_PER_TICK }
        ],
        tools: [
            { commodity: commodity.pickaxe, amount: 1 }
        ],
        outputs: [
            { commodity: commodity.coal, amount: 1 }
        ],
        cost: [
            { commodity: commodity.pickaxe, amount: 2 }
        ],
        strength_multiplier: 1,
        vitality_multiplier: 1,
        magic_multiplier: 1,
        fluids_multiplier: 0,
        skill: skills.mining
    };
    buildings.ore_mine = {
        name: "Ore Mine",
        inputs: [
            { commodity: commodity.ore_source, amount: RESOURCE_DRAIN_PER_TICK }
        ],
        tools: [
            { commodity: commodity.pickaxe, amount: 1 }
        ],
        outputs: [
            { commodity: commodity.ore, amount: 1 }
        ],
        cost: [
            { commodity: commodity.pickaxe, amount: 2 }
        ],
        strength_multiplier: 1,
        vitality_multiplier: 1,
        magic_multiplier: 1,
        fluids_multiplier: 0,
        skill: skills.mining
    };
    buildings.smelter = {
        name: "Smelter",
        inputs: [
            { commodity: commodity.coal, amount: 1 },
            { commodity: commodity.ore, amount: 1 }
        ],
        tools: [
            { commodity: commodity.shovel, amount: 1 }
        ],
        outputs: [
            { commodity: commodity.ingot, amount: 1 }
        ],
        cost: [
            { commodity: commodity.bricks, amount: 2 },
        ],
        strength_multiplier: 1,
        vitality_multiplier: 0,
        magic_multiplier: 1,
        fluids_multiplier: 0,
        skill: skills.smelting
    };
    buildings.magesmith = {
        name: "Magesmith",
        inputs: [
            { commodity: commodity.essence, amount: 1 },
            { commodity: commodity.ingot, amount: 1 }
        ],
        tools: [
            { commodity: commodity.magic_tools, amount: 1 }
        ],
        outputs: [
            { commodity: commodity.magic_tools, amount: 1 }
        ],
        cost: [
            { commodity: commodity.anvil, amount: 2 },
            { commodity: commodity.urban_land, amount: 1 }
        ],
        strength_multiplier: 0,
        vitality_multiplier: 0,
        magic_multiplier: 1,
        fluids_multiplier: 0,
        skill: skills.magesmith
    };
    buildings.well = {
        name: "Well",
        inputs: [],
        tools: [],
        outputs: [
            { commodity: commodity.water, amount: 1 }
        ],
        cost: [
            { commodity: commodity.shovel, amount: 1 }
        ],
        strength_multiplier: 1,
        vitality_multiplier: 0,
        magic_multiplier: 0,
        fluids_multiplier: 0,
        skill: skills.movement
    };
    buildings.blood_extractor = {
        name: "Blood Extractor",
        inputs: [],
        tools: [
            { commodity: commodity.magic_tools, amount: 1 }
        ],
        outputs: [
            { commodity: commodity.blood, amount: 1 }
        ],
        cost: [
            { commodity: commodity.magic_tools, amount: 1 },
            { commodity: commodity.urban_land, amount: 1 }
        ],
        strength_multiplier: 0,
        vitality_multiplier: 1,
        magic_multiplier: 0,
        fluids_multiplier: 0,
        skill: skills.movement
    };
    buildings.blender = {
        name: "Blender",
        inputs: [
            { commodity: commodity.corpses, amount: 1 }
        ],
        tools: [
            { commodity: commodity.magic_tools, amount: 1 }
        ],
        outputs: [
            { commodity: commodity.blood, amount: 10 }
        ],
        cost: [
            { commodity: commodity.magic_tools, amount: 1 },
            { commodity: commodity.urban_land, amount: 1 }
        ],
        strength_multiplier: 1,
        vitality_multiplier: 0,
        magic_multiplier: 0,
        fluids_multiplier: 0,
        skill: skills.movement
    };
    buildings.hunting_0 = {
        name: "Hunting Grounds",
        inputs: [],
        tools: [
            { commodity: commodity.weapons, amount: 1 }
        ],
        outputs: [
            { commodity: commodity.corpses, amount: 1 }
        ],
        cost: [
            { commodity: commodity.weapons, amount: 1 },
            { commodity: commodity.rural_land, amount: 1 }
        ],
        strength_multiplier: 1,
        vitality_multiplier: 0,
        magic_multiplier: 1,
        fluids_multiplier: 0,
        skill: skills.hunting
    };
    buildings.hunting_1 = {
        name: "Enchanted Hunting Grounds",
        inputs: [],
        tools: [
            { commodity: commodity.enchanted_weapons, amount: 1 }
        ],
        outputs: [
            { commodity: commodity.corpses, amount: 2 }
        ],
        cost: [
            { commodity: commodity.enchanted_weapons, amount: 1 },
            { commodity: commodity.rural_land, amount: 1 }
        ],
        strength_multiplier: 1,
        vitality_multiplier: 0,
        magic_multiplier: 1,
        fluids_multiplier: 0,
        skill: skills.hunting
    };
    buildings.essence_mixer = {
        name: "Essence Mixer",
        inputs: [
            { commodity: commodity.water, amount: 1 },
            { commodity: commodity.blood, amount: 1 },
            { commodity: commodity.fluids, amount: 1 }
        ],
        tools: [
            { commodity: commodity.magic_tools, amount: 1 }
        ],
        outputs: [
            { commodity: commodity.essence, amount: 1 }
        ],
        cost: [
            { commodity: commodity.magic_tools, amount: 1 },
            { commodity: commodity.urban_land, amount: 1 }
        ],
        strength_multiplier: 0,
        vitality_multiplier: 0,
        magic_multiplier: 1,
        fluids_multiplier: 0,
        skill: skills.enchanting
    };
    buildings.condensor = {
        name: "Magic Condensor",
        inputs: [
            { commodity: commodity.water, amount: 1 },
            { commodity: commodity.essence, amount: 1 }
        ],
        tools: [
            { commodity: commodity.magic_tools, amount: 1 }
        ],
        outputs: [
            { commodity: commodity.magic_crystals, amount: 1 }
        ],
        cost: [
            { commodity: commodity.magic_tools, amount: 1 },
            { commodity: commodity.urban_land, amount: 1 }
        ],
        strength_multiplier: 0,
        vitality_multiplier: 0,
        magic_multiplier: 1,
        fluids_multiplier: 0,
        skill: skills.enchanting
    };
    buildings.fluids_extractor = {
        name: "Fluids Extractor",
        inputs: [
            { commodity: commodity.water, amount: 1 }
        ],
        tools: [],
        outputs: [
            { commodity: commodity.fluids, amount: 1 }
        ],
        cost: [
            { commodity: commodity.magic_tools, amount: 1 },
            { commodity: commodity.urban_land, amount: 1 }
        ],
        strength_multiplier: 0,
        vitality_multiplier: 0,
        magic_multiplier: 0,
        fluids_multiplier: 1,
        skill: skills.movement
    };
    buildings.weaponsmith = {
        name: "Weaponsmith",
        inputs: [
            { commodity: commodity.ingot, amount: 1 }
        ],
        tools: [
            { commodity: commodity.anvil, amount: 1 }
        ],
        outputs: [
            { commodity: commodity.weapons, amount: 1 }
        ],
        cost: [
            { commodity: commodity.anvil, amount: 1 },
            { commodity: commodity.urban_land, amount: 1 }
        ],
        strength_multiplier: 1,
        vitality_multiplier: 0,
        magic_multiplier: 0,
        fluids_multiplier: 0,
        skill: skills.smith
    };
    buildings.enchanting = {
        name: "Enchancing Shop",
        inputs: [
            { commodity: commodity.weapons, amount: 1 },
            { commodity: commodity.essence, amount: 1 }
        ],
        tools: [
            { commodity: commodity.magic_tools, amount: 1 }
        ],
        outputs: [
            { commodity: commodity.enchanted_weapons, amount: 1 }
        ],
        cost: [
            { commodity: commodity.magic_tools, amount: 1 },
            { commodity: commodity.urban_land, amount: 1 }
        ],
        strength_multiplier: 0,
        vitality_multiplier: 0,
        magic_multiplier: 1,
        fluids_multiplier: 0,
        skill: skills.enchanting
    };
})(buildings || (buildings = {}));
var base_production = [
    {
        def: buildings.coal_mine,
        scale: 0
    },
    {
        def: buildings.ore_mine,
        scale: 0
    },
    {
        def: buildings.smelter,
        scale: 0
    },
    {
        def: buildings.well,
        scale: 0
    },
    {
        def: buildings.condensor,
        scale: 0
    },
    {
        def: buildings.magesmith,
        scale: 0
    },
    {
        def: buildings.essence_mixer,
        scale: 0
    }
];
var worker_to_building = new Map();
var building_to_worker = new Map();
function employ(worker, building) {
    var old_employer = worker_to_building.get(worker.id);
    var old_worker = building_to_worker.get(building.id);
    if (old_employer) {
        building_to_worker.delete(old_employer.id);
    }
    if (old_worker) {
        worker_to_building.delete(old_worker.id);
    }
    worker_to_building.set(worker.id, building);
    building_to_worker.set(building.id, worker);
}
var property = [];
var property_vacant_id = 0;
function new_building(def) {
    property[property_vacant_id] = {
        id: property_vacant_id,
        definition: def
    };
    property_vacant_id++;
    return property_vacant_id;
}
new_building(buildings.ore_mine);
function build_new_building(def) {
    var enough_goods = true;
    for (var _i = 0, _a = def.cost; _i < _a.length; _i++) {
        var item = _a[_i];
        if (inventory[item.commodity] < item.amount) {
            enough_goods = false;
        }
    }
    if (!enough_goods)
        return undefined;
    for (var _b = 0, _c = def.cost; _b < _c.length; _b++) {
        var item = _c[_b];
        inventory[item.commodity] -= item.amount;
    }
    return new_building(def);
}
function div_building_definition(def) {
    var frame = document.createElement("div");
    var label = document.createElement("div");
    label.innerHTML = def.name;
    frame.appendChild(label);
    frame.appendChild(div_commodity_set("Inputs", def.inputs));
    frame.appendChild(div_commodity_set("Outputs", def.outputs));
    frame.appendChild(div_commodity_set("Tools", def.tools));
    frame.appendChild(div_commodity_set("Cost", def.cost));
    var stats = new_div();
    stats.appendChild(new_label("Multipliers"));
    stats.appendChild(new_label("Strength " + def.strength_multiplier));
    stats.appendChild(new_label("Vitality " + def.vitality_multiplier));
    stats.appendChild(new_label("Magic " + def.magic_multiplier));
    stats.appendChild(new_label("Fluids " + def.fluids_multiplier));
    frame.appendChild(stats);
    var button = document.createElement("div");
    button.classList.add("button");
    button.innerText = "Build";
    button.onclick = (function () { build_new_building(def); update_property_list(); });
    frame.appendChild(button);
    return frame;
}
function update() {
    update_contracts();
    // contracts:
    for (var _i = 0, player_contracts_3 = player_contracts; _i < player_contracts_3.length; _i++) {
        var contract = player_contracts_3[_i];
        var actual_contract = contracts[contract.contract_id];
        var supply = supply_data[actual_contract.seller];
        var demand = demand_data[actual_contract.customer];
        if (supply.player) {
            var transaction_volume = supply.amount;
            if (inventory[supply.commodity] < transaction_volume) {
                transaction_volume = inventory[supply.commodity];
            }
            if (actual_contract.expected_volume != undefined) {
                if (actual_contract.expected_volume < transaction_volume) {
                    transaction_volume = actual_contract.expected_volume;
                }
            }
            if (actual_contract.expected_volume != undefined) {
                actual_contract.expected_volume -= transaction_volume;
            }
            inventory[supply.commodity] -= transaction_volume;
            demand.inventory += transaction_volume;
            inventory[contract.target_lord.monetary_preference] += transaction_volume * actual_contract.negotiated_price;
            // lords currently possess no inventory to store currency
        }
        if (demand.player) {
            var transaction_volume = supply.amount;
            if (supply.inventory < transaction_volume) {
                transaction_volume = supply.inventory;
            }
            if (actual_contract.expected_volume != undefined) {
                if (actual_contract.expected_volume < transaction_volume) {
                    transaction_volume = actual_contract.expected_volume;
                }
            }
            var available_budget = inventory[contract.target_lord.monetary_preference] + actual_contract.locked_currency;
            if (available_budget / actual_contract.negotiated_price < transaction_volume) {
                transaction_volume = available_budget / actual_contract.negotiated_price;
            }
            if (actual_contract.expected_volume != undefined) {
                actual_contract.expected_volume -= transaction_volume;
            }
            inventory[supply.commodity] += transaction_volume;
            supply.inventory -= transaction_volume;
            inventory[contract.target_lord.monetary_preference] -= transaction_volume * actual_contract.negotiated_price;
            // lords currently possess no inventory to store currency
        }
    }
    for (var i = 0; i < contracts.length; i++) {
        update_all_contract_volume_labels(i);
        var actual_contract = contracts[i];
        var supply = supply_data[actual_contract.seller];
        var demand = demand_data[actual_contract.customer];
        if (supply.player) {
            continue;
        }
        if (demand.player) {
            continue;
        }
        var transaction_volume = supply.amount;
        if (supply.inventory < transaction_volume) {
            transaction_volume = supply.inventory;
        }
        if (actual_contract.expected_volume != undefined) {
            if (actual_contract.expected_volume < transaction_volume) {
                transaction_volume = actual_contract.expected_volume;
            }
        }
        if (actual_contract.expected_volume != undefined) {
            actual_contract.expected_volume -= transaction_volume;
        }
        demand.inventory += transaction_volume;
        supply.inventory -= transaction_volume;
    }
    // update lords:
    for (var _a = 0, known_lords_2 = known_lords; _a < known_lords_2.length; _a++) {
        var lord = known_lords_2[_a];
        for (var _b = 0, _c = lord.production; _b < _c.length; _b++) {
            var supply_index = _c[_b];
            var method = supply_data[supply_index];
            var inputs_available = 1;
            for (var _d = 0, _e = method.inputs; _d < _e.length; _d++) {
                var demand_index = _e[_d];
                var item = demand_data[demand_index];
                inputs_available = Math.min(inputs_available, item.inventory / item.inventory);
            }
            for (var _f = 0, _g = method.inputs; _f < _g.length; _f++) {
                var demand_index = _g[_f];
                var item = demand_data[demand_index];
                item.inventory -= item.amount * inputs_available;
            }
            method.inventory += method.amount * inputs_available;
            // update lord prices
            var manufacture_cost = 0;
            for (var _h = 0, _j = method.inputs; _h < _j.length; _h++) {
                var demand_index = _j[_h];
                var item = demand_data[demand_index];
                manufacture_cost += item.amount * item.price;
            }
            if (manufacture_cost > method.price) {
                method.price = manufacture_cost * 1.5;
                changed_supply_prices.set(supply_index, true);
            }
            // // update prices:
            // for (let item of method.inputs) {
            //     if (price_buy[item.commodity] == MAX_PRICE) {
            //         price_buy[item.commodity] = item.price * 1.1
            //     } else {
            //         price_buy[item.commodity] = Math.min(price_buy[item.commodity], item.price * 1.1)
            //     }
            // }
            // if (price_sell[method.production.commodity] == 0) {
            //     price_sell[method.production.commodity] = method.production.price * 0.9
            // } else {
            //     price_sell[method.production.commodity] = Math.max(price_sell[method.production.commodity], method.production.price * 0.9)
            // }
        }
    }
    // local_supply.fill(100, 0, commodity.total)
    //decay inventory and set baseline demand/supply:
    for (var i = 0; i < commodity.total; i++) {
        if (i == commodity.magic_crystals) {
            continue;
        }
        var decay = commodity_definition[i].decay * inventory[i];
        inventory[i] -= decay;
        inventory[i] = Math.max(0, inventory[i]);
    }
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
    // try to buy/sell
    // suppose we can always buy and sell
    for (var i = 0; i < commodity.total; i++) {
        if (trade[i] > 0) { //buy
            if (inventory[commodity.coins] > trade[i] * price_buy[i]) {
                inventory[commodity.coins] -= trade[i] * price_buy[i];
                // local_demand[i] += trade[i]
                inventory[i] += trade[i];
            }
        }
        else { //sell
            if (inventory[i] + trade[i] > 0) {
                inventory[i] += trade[i];
                // local_supply[i] -= trade[i]
                inventory[commodity.coins] -= trade[i] * price_sell[i];
            }
        }
    }
    // change prices
    for (var i = 1; i < commodity.total; i++) {
        // let balance = local_demand[i] - local_supply[i]
        // price[i] += balance / 10000 * price[i]
        // price[i] = Math.max(price[i], 0.001)
    }
    var reserved_inventory = [];
    ;
    reserved_inventory.length = commodity.total;
    reserved_inventory.fill(0, 0, commodity.total);
    for (var _k = 0, property_1 = property; _k < property_1.length; _k++) {
        var building = property_1[_k];
        var worker = building_to_worker.get(building.id);
        if (!worker)
            continue;
        var skill = worker.skills[building.definition.skill];
        if (Math.random() * 10 > skill) {
            worker.skills[building.definition.skill]++;
        }
        var max_throughput = building.definition.magic_multiplier * worker.magic
            + building.definition.strength_multiplier * worker.strength
            + building.definition.vitality_multiplier * worker.vitality
            + building.definition.fluids_multiplier * worker.fluids;
        var have_tools = true;
        for (var _l = 0, _m = building.definition.tools; _l < _m.length; _l++) {
            var item = _m[_l];
            if (inventory[item.commodity] - reserved_inventory[item.commodity] < item.amount) {
                have_tools = false;
            }
        }
        if (have_tools) {
            max_throughput = max_throughput * 2;
        }
        max_throughput = max_throughput * (0.01 + worker.skills[building.definition.skill] * 0.01);
        var input_multiplier = 1;
        for (var _o = 0, _p = building.definition.inputs; _o < _p.length; _o++) {
            var item = _p[_o];
            if (inventory[item.commodity] - reserved_inventory[item.commodity] < item.amount * max_throughput) {
                input_multiplier = Math.min(input_multiplier, inventory[item.commodity] - reserved_inventory[item.commodity] / (item.amount * max_throughput));
            }
        }
        max_throughput = max_throughput * input_multiplier;
        for (var _q = 0, _r = building.definition.inputs; _q < _r.length; _q++) {
            var item = _r[_q];
            var spent = item.amount * max_throughput;
            inventory[item.commodity] -= spent;
            inventory[item.commodity] = Math.max(0, inventory[item.commodity]);
        }
        for (var _s = 0, _t = building.definition.outputs; _s < _t.length; _s++) {
            var item = _t[_s];
            var produced = item.amount * max_throughput;
            inventory[item.commodity] += produced;
        }
        if (have_tools)
            for (var _u = 0, _v = building.definition.tools; _u < _v.length; _u++) {
                var item = _v[_u];
                inventory[item.commodity] -= item.amount * 0.01;
                reserved_inventory[item.commodity] += item.amount * 0.99;
            }
    }
}
function update_property_list() {
    var frame = document.getElementById("property-frame");
    if (frame == undefined) {
        alert("No property frame");
        return;
    }
    frame.innerHTML = "";
    var _loop_1 = function (item) {
        var row = document.createElement("div");
        row.id = "b" + item.id;
        row.innerHTML = item.definition.name + " ID:" + item.id;
        var hire_button = document.createElement("div");
        hire_button.classList.add("button");
        hire_button.innerHTML = "Hire selected worker in this building";
        hire_button.onclick = function () {
            employ(selected_worker, item);
            update_property_list();
        };
        var worker_div = document.createElement("div");
        var image_div = undefined;
        if (building_to_worker.has(item.id)) {
            worker_div.innerHTML = "Worker: " + building_to_worker.get(item.id).name;
            image_div = document.createElement("img");
            image_div.src = building_to_worker.get(item.id).portrait;
        }
        else {
            worker_div.innerHTML = "Worker: None";
        }
        frame.appendChild(row);
        row.appendChild(hire_button);
        row.appendChild(worker_div);
        if (image_div)
            row.appendChild(image_div);
    };
    for (var _i = 0, property_2 = property; _i < property_2.length; _i++) {
        var item = property_2[_i];
        _loop_1(item);
    }
}
window.onload = function () {
    init_inventory_frame();
    var lords_frame = document.getElementById("lords-frame");
    for (var _i = 0, known_lords_3 = known_lords; _i < known_lords_3.length; _i++) {
        var lord = known_lords_3[_i];
        lords_frame.appendChild(make_lord_div(lord));
    }
    update_workers_list();
    update_property_list();
    {
        var frame = document.getElementById("control-frame");
        if (frame == undefined) {
            alert("No control frame");
            return;
        }
        frame.appendChild(div_building_definition(buildings.ore_mine));
        frame.appendChild(div_building_definition(buildings.coal_mine));
        frame.appendChild(div_building_definition(buildings.smelter));
        frame.appendChild(div_building_definition(buildings.magesmith));
        frame.appendChild(div_building_definition(buildings.well));
        frame.appendChild(div_building_definition(buildings.condensor));
        frame.appendChild(div_building_definition(buildings.blender));
        frame.appendChild(div_building_definition(buildings.blood_extractor));
        frame.appendChild(div_building_definition(buildings.essence_mixer));
        frame.appendChild(div_building_definition(buildings.fluids_extractor));
        frame.appendChild(div_building_definition(buildings.hunting_0));
        frame.appendChild(div_building_definition(buildings.hunting_1));
        frame.appendChild(div_building_definition(buildings.weaponsmith));
        frame.appendChild(div_building_definition(buildings.enchanting));
    }
    document.getElementById("gacha-button").onclick = pull_daemon_characters;
    var update_timer = 0;
    var start = undefined;
    function callback(timestamp) {
        if (start == undefined) {
            start = timestamp;
        }
        var dt = timestamp - start;
        update_timer += dt;
        while (update_timer > 100) {
            update_timer -= 100;
            update();
            update_inventory_frame();
            update_skills();
        }
        start = timestamp;
        window.requestAnimationFrame(callback);
    }
    window.requestAnimationFrame(callback);
};
