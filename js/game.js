var new_div = function () { return document.createElement("div"); };
var new_label = function (label) { var d = document.createElement("div"); d.innerHTML = label; return d; };
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
    commodity.total = 16;
})(commodity || (commodity = {}));
var commodity_definition = [];
commodity_definition[commodity.coins] = {
    name: "Coins",
    base_spendings: 0,
    base_production: 0
};
commodity_definition[commodity.fluids] = {
    name: "Fluids",
    base_spendings: 1000,
    base_production: 5
};
commodity_definition[commodity.blood] = {
    name: "Blood",
    base_spendings: 1000,
    base_production: 10
};
commodity_definition[commodity.water] = {
    name: "Water",
    base_spendings: 10,
    base_production: 100
};
commodity_definition[commodity.weapons] = {
    name: "Weapons",
    base_spendings: 5000,
    base_production: 1000
};
commodity_definition[commodity.enchanted_weapons] = {
    name: "Enchanted Weapons",
    base_spendings: 10000,
    base_production: 100
};
commodity_definition[commodity.magic_crystals] = {
    name: "Magic crystals",
    base_spendings: 1000,
    base_production: 10
};
commodity_definition[commodity.ore] = {
    name: "Ore",
    base_spendings: 20000,
    base_production: 10000
};
commodity_definition[commodity.ingot] = {
    name: "Ingots",
    base_spendings: 20000,
    base_production: 1000
};
commodity_definition[commodity.coal] = {
    name: "Coal",
    base_spendings: 20000,
    base_production: 10000
};
commodity_definition[commodity.anvil] = {
    name: "Anvil",
    base_spendings: 2200,
    base_production: 100
};
commodity_definition[commodity.pickaxe] = {
    name: "Pickaxe",
    base_spendings: 2000,
    base_production: 100
};
commodity_definition[commodity.shovel] = {
    name: "Shovel",
    base_spendings: 2000,
    base_production: 100
};
commodity_definition[commodity.magic_tools] = {
    name: "Magic Tools",
    base_spendings: 1000000,
    base_production: 10
};
commodity_definition[commodity.bricks] = {
    name: "Bricks",
    base_spendings: 10000,
    base_production: 1000
};
commodity_definition[commodity.clay] = {
    name: "Clay",
    base_spendings: 10000,
    base_production: 1000
};
var inventory = [];
var trade = [];
var price = [];
var local_supply = [];
var local_demand = [];
inventory.length = commodity.total;
trade.length = commodity.total;
price.length = commodity.total;
local_supply.length = commodity.total;
local_demand.length = commodity.total;
inventory.fill(0, 0, commodity.total);
trade.fill(0, 0, commodity.total);
price.fill(100, 0, commodity.total);
price[commodity.coins] = 1;
inventory[commodity.magic_crystals] = 2000;
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
        have.innerHTML = "Have: " + inventory[i];
        var trade_div = document.createElement("div");
        trade_div.id = "trade" + i;
        trade_div.innerHTML = "Trade: " + trade[i];
        var button_increase_trade = document.createElement("div");
        button_increase_trade.classList.add("button");
        button_increase_trade.innerHTML = "Buy more";
        button_increase_trade.onclick = trade_change(i, 1);
        var button_decrease_trade = document.createElement("div");
        button_decrease_trade.classList.add("button");
        button_decrease_trade.innerHTML = "Sell more";
        button_decrease_trade.onclick = trade_change(i, -1);
        var price_div = document.createElement("div");
        price_div.id = "price" + i;
        price_div.innerHTML = "Price: " + price[i];
        frame.appendChild(item);
        item.appendChild(label);
        item.appendChild(have);
        item.appendChild(button_increase_trade);
        item.appendChild(trade_div);
        item.appendChild(button_decrease_trade);
        item.appendChild(price_div);
    }
}
function update_inventory_frame() {
    for (var i = 0; i < commodity.total; i++) {
        var have = document.getElementById("inv" + i);
        have.innerHTML = "Have: " + inventory[i];
        var trade_div = document.getElementById("trade" + i);
        trade_div.innerHTML = "Trade: " + trade[i];
        var price_div = document.getElementById("price" + i);
        price_div.innerHTML = "Price: " + price[i];
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
    skills.total = 6;
})(skills || (skills = {}));
var skill_names = {};
skill_names[skills.mining] = "mining";
skill_names[skills.enchanting] = "enchanting";
skill_names[skills.smelting] = "smelting";
skill_names[skills.smith] = "smith";
skill_names[skills.magesmith] = "magesmith";
function base_skill() {
    var result = [];
    result.length = skills.total;
    result.fill(0, 0, skills.total);
    return result;
}
var player = {
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
};
var imp = {
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
};
imp.skills[skills.mining] = 20;
var minor_imp = {
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
};
minor_imp.skills[skills.mining] = 5;
var minor_eyeful = {
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
};
var slime_black = {
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
};
var deel_rub = {
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
};
deel_rub.skills[skills.smelting] = 20;
deel_rub.skills[skills.smith] = 20;
var deel_sar = {
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
};
deel_sar.skills[skills.smelting] = 20;
deel_sar.skills[skills.smith] = 40;
var marela = {
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
};
marela.skills[skills.magesmith] = 50;
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
var daemons_pool = [minor_imp, imp, deel_rub, deel_sar];
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
    if (inventory[commodity.magic_crystals] < 1000) {
        return;
    }
    inventory[commodity.magic_crystals] -= 1000;
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
var coal_mine = {
    name: "Coal Mine",
    inputs: [],
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
    skill: skills.mining
};
var ore_mine = {
    name: "Ore Mine",
    inputs: [],
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
    skill: skills.mining
};
var smelter = {
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
        { commodity: commodity.bricks, amount: 2 }
    ],
    strength_multiplier: 1,
    vitality_multiplier: 0,
    magic_multiplier: 1,
    skill: skills.smelting
};
var magesmith = {
    name: "Magesmith",
    inputs: [
        { commodity: commodity.ingot, amount: 1 }
    ],
    tools: [
        { commodity: commodity.magic_tools, amount: 1 }
    ],
    outputs: [
        { commodity: commodity.magic_tools, amount: 1 }
    ],
    cost: [
        { commodity: commodity.anvil, amount: 2 }
    ],
    strength_multiplier: 0,
    vitality_multiplier: 0,
    magic_multiplier: 1,
    skill: skills.magesmith
};
var well = {
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
    skill: skills.movement
};
var condensor = {
    name: "Magic Condensor",
    inputs: [
        { commodity: commodity.water, amount: 100 }
    ],
    tools: [],
    outputs: [
        { commodity: commodity.magic_crystals, amount: 1 }
    ],
    cost: [
        { commodity: commodity.magic_tools, amount: 1 }
    ],
    strength_multiplier: 0,
    vitality_multiplier: 0,
    magic_multiplier: 1,
    skill: skills.enchanting
};
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
new_building(ore_mine);
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
    frame.appendChild(stats);
    var button = document.createElement("div");
    button.classList.add("button");
    button.innerText = "Build";
    button.onclick = (function () { build_new_building(def); update_property_list(); });
    frame.appendChild(button);
    return frame;
}
function update() {
    //decay inventory and set baseline demand/supply:
    for (var i = 0; i < commodity.total; i++) {
        var decay = Math.floor(0.0001 * inventory[i]);
        if (decay == 0) {
            if (Math.random() < 0.0001 * inventory[i]) {
                decay = 1;
            }
        }
        inventory[i] -= decay;
        inventory[i] = Math.max(0, inventory[i]);
        local_demand[i] = commodity_definition[i].base_spendings / price[i];
        local_supply[i] = commodity_definition[i].base_production * (1 + price[i] / 100);
    }
    // try to buy/sell
    // suppose we can always buy and sell
    for (var i = 0; i < commodity.total; i++) {
        if (trade[i] > 0) { //buy
            if (inventory[commodity.coins] > trade[i] * price[i]) {
                inventory[commodity.coins] -= trade[i] * price[i];
                local_demand[i] += trade[i];
                inventory[i] += trade[i];
            }
        }
        else { //sell
            if (inventory[i] + trade[i] > 0) {
                inventory[i] += trade[i];
                local_supply[i] -= trade[i];
                inventory[commodity.coins] -= trade[i] * price[i];
            }
        }
    }
    // change prices
    for (var i = 0; i < commodity.total; i++) {
        if (local_demand[i] < local_supply[i]) {
            price[i] = Math.max(1, price[i] - 1);
        }
        else {
            price[i] = price[i] + 1;
        }
    }
    var reserved_inventory = [];
    ;
    reserved_inventory.length = commodity.total;
    reserved_inventory.fill(0, 0, commodity.total);
    for (var _i = 0, property_1 = property; _i < property_1.length; _i++) {
        var building = property_1[_i];
        var worker = building_to_worker.get(building.id);
        if (!worker)
            continue;
        var max_throughput = building.definition.magic_multiplier * worker.magic
            + building.definition.strength_multiplier * worker.strength
            + building.definition.vitality_multiplier * worker.vitality;
        var have_tools = true;
        for (var _a = 0, _b = building.definition.tools; _a < _b.length; _a++) {
            var item = _b[_a];
            if (inventory[item.commodity] - reserved_inventory[item.commodity] < item.amount) {
                have_tools = false;
            }
        }
        if (have_tools) {
            max_throughput = max_throughput * 2;
        }
        max_throughput = max_throughput * 0.1 + worker.skills[building.definition.skill] * 0.01;
        var input_multiplier = 1;
        for (var _c = 0, _d = building.definition.inputs; _c < _d.length; _c++) {
            var item = _d[_c];
            if (inventory[item.commodity] - reserved_inventory[item.commodity] < item.amount * max_throughput) {
                input_multiplier = Math.min(input_multiplier, inventory[item.commodity] - reserved_inventory[item.commodity] / (item.amount * max_throughput));
            }
        }
        max_throughput = max_throughput * input_multiplier;
        for (var _e = 0, _f = building.definition.inputs; _e < _f.length; _e++) {
            var item = _f[_e];
            var spent = Math.round(item.amount * max_throughput + 0.5);
            inventory[item.commodity] -= spent;
            inventory[item.commodity] = Math.max(0, inventory[item.commodity]);
        }
        for (var _g = 0, _h = building.definition.outputs; _g < _h.length; _g++) {
            var item = _h[_g];
            var produced = item.amount * max_throughput;
            inventory[item.commodity] += Math.floor(produced);
            if (Math.random() < produced - Math.floor(produced)) {
                inventory[item.commodity] += 1;
            }
        }
        for (var _j = 0, _k = building.definition.tools; _j < _k.length; _j++) {
            var item = _k[_j];
            reserved_inventory[item.commodity] += item.amount * max_throughput;
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
        frame.appendChild(hire_button);
        frame.appendChild(worker_div);
        if (image_div)
            frame.appendChild(image_div);
    };
    for (var _i = 0, property_2 = property; _i < property_2.length; _i++) {
        var item = property_2[_i];
        _loop_1(item);
    }
}
window.onload = function () {
    init_inventory_frame();
    update_workers_list();
    update_property_list();
    {
        var frame = document.getElementById("control-frame");
        if (frame == undefined) {
            alert("No control frame");
            return;
        }
        frame.appendChild(div_building_definition(ore_mine));
        frame.appendChild(div_building_definition(coal_mine));
        frame.appendChild(div_building_definition(smelter));
        frame.appendChild(div_building_definition(magesmith));
        frame.appendChild(div_building_definition(well));
        frame.appendChild(div_building_definition(condensor));
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
        }
        start = timestamp;
        window.requestAnimationFrame(callback);
    }
    window.requestAnimationFrame(callback);
};
