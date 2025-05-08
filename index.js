function parse_bead_table(input) {
    const color_to_group = {"blue": 1, "yellow": 2, "red": 3, "green": 4};
    const group_to_color = {"1": "blue", "2": "yellow", "3": "red", "4": "green"};
    const beads = ["tongi", "oranu", "ranaka", "matu", "urapa"];

    var talisman = document.getElementsByTagName("lutaritalisman")[0];

    for (const [key, value] of Object.entries(input)) {


        let group = [...talisman.children].find(i => color_to_group[key] == i.dataset.group );

        if (!group) {
            console.error("Invalid key in bead table: `%O`", key);
            continue;
        };

        for (const bead of value) {
            if (!Number.isInteger(bead.pos)) {
                console.error("Bead position `%O` is not an integer", bead.pos);
                continue;
            }

            if (!Number.isInteger(bead.type)) {
                console.error("Bead type `%O` is not an integer", bead.type);
                continue;
            }

            [...group.children].find(i => parseInt(i.dataset.pos) === bead.pos).dataset.type = beads[bead.type - 1];
        }
    }
}

parse_bead_table({
    "blue": [{pos: 1, type:4}, {pos: 2, type:1}, {pos: 3, type:3}],
    "green": [{pos: 1, type:4}, {pos: 4, type:2}, {pos: 5, type:5}],
    "red": [{pos: 3, type: 3 }],
    "yellow": [{pos: 5, type: 5}]
});