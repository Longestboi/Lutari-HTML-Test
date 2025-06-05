/**
 * Lutari Talisman
 *
 */

/**
 * Sets the talismans bead groups to represent the ones the user has
 *
 */
function parse_bead_table(input, reset) {
  const color_to_group = { blue: 1, yellow: 2, red: 3, green: 4 };
  const group_to_color = { 1: "blue", 2: "yellow", 3: "red", 4: "green" };
  const beads = ["tongi", "oranu", "ranaka", "matu", "urapa"];

  var talisman = document.getElementsByTagName("lutaritalisman")[0];

  if (reset === true) {
    for (const e of [...talisman.children]) {
      [...e.children].forEach((f) => (f.dataset.type = "none"));
    }
  }

  for (const [key, value] of Object.entries(input)) {
    let group = [...talisman.children].find(
      (i) => color_to_group[key] == i.dataset.group,
    );

    if (!group) {
      console.error("Invalid key in bead table: `%O`", key);
      continue;
    }

    for (const bead of value) {
      if (!Number.isInteger(bead.pos)) {
        console.error("Bead position `%O` is not an integer", bead.pos);
        continue;
      }

      if (!Number.isInteger(bead.type)) {
        console.error("Bead type `%O` is not an integer", bead.type);
        continue;
      }

      [...group.children].find(
        (i) => parseInt(i.dataset.pos) === bead.pos,
      ).dataset.type = beads[bead.type - 1];
    }
  }
}
