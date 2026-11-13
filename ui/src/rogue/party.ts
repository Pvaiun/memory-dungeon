/** Managing the party outside a fight: seats and the camp, the bag and its junk, a piece put on from the bag, a unit's sheet and ability order, its gear. */
import { bar, button, type Child, h, header, nav, toast, win } from "../dom.js";
import { current, fighter, saveRogue, vitals } from "./state.js";
import { bag, bench, canManage, formationRarity, formOf, type Item, itemGear, itemOf, member, passiveOf, rogue, type RogueRun, seatsOf, type Slot, wearer } from "../../../src/rogue.js";
import { c, cls as classOf, disp, shortName } from "../content.js";
import { dismiss, equip, junk, seat, setFormation, setOrder, swap } from "../../../src/rogue/record.js";
import { abilityBlock, aggShares, basicLine, canUse, classHead, classPassive, gearRow, type GearSlot, lockedRow, seatCodes, seatNotes, section, SLOTS, specialLines, statGrid, twoHanded } from "../sheet.js";
import { faceEl } from "../pixel.js";
import { setup } from "../state.js";
import { weaponOf } from "../../../src/engine/combat/fight.js";
import { plainWeapon } from "../../../src/sim/parties.js";
import { canEquip } from "../../../src/validate.js";
import { rogueScreen, supplyRow } from "./run.js";
import { comesOff, confirm, frameEl, go, itemRow, junkRow, RARITY_CLASS, ROMAN } from "./parts.js";

// ─── Managing the party ────────────────────────────────────────────────────

let seatPick: number | null = null;
export function rpartyScreen(): Child[] {
  const run = current();
  if (!run) return rogueScreen();
  const manage = canManage(run);
  const f = c.formations.get(run.formation)!;
  const fi = run.formations.indexOf(run.formation);
  const setF = (i: number) => { setFormation(c, run, run.formations[(i + run.formations.length) % run.formations.length]); saveRogue(); go("rparty", undefined, true); };
  const prev = button("◀", () => setF(fi - 1), "sm"), nxt = button("▶", () => setF(fi + 1), "sm");
  prev.disabled = nxt.disabled = run.formations.length < 2 || !manage;
  const agg = aggShares(run.party.map((cls) => (vitals(run, cls).ko ? null : fighter(run, cls).stats.aggro ?? 100)));
  const cards = run.party.map((cls, i) => {
    const pos = f.positions[i];
    const v = vitals(run, cls);
    return h("div", { class: `win card${seatPick === i ? " cur" : ""}${manage && seatPick !== null && seatPick !== i ? " target" : ""}`, onClick: () => {
      if (!manage) return go("runit", cls);
      if (seatPick === null) seatPick = i;
      else if (seatPick === i) { seatPick = null; return go("runit", cls); }
      else { const o = [...run.party]; [o[seatPick], o[i]] = [o[i], o[seatPick]]; seat(c, run, o); seatPick = null; saveRogue(); }
      go("rparty", undefined, true);
    } },
      h("div", { class: "slot" }, pos.name),
      agg[i] ? h("div", { class: "slot dim" }, agg[i]) : null,
      h("div", { class: "portrait" }, faceEl(cls)),
      h("div", { class: "name" }, shortName(cls)),
      v.ko ? h("div", { class: "bad" }, "KO") : bar(v.hp / v.maxHp),
      v.maxMp ? bar(v.mp / v.maxMp, "mp") : null,
      h("div", { class: "codes" }, ...seatCodes(pos)),
    );
  });
  const camp = bench(run);
  // The bag: a piece tapped shows who could wear it; JUNK sends it to the bottom, greyed, to sell at a shop.
  const kept = bag(run).filter((it) => !it.junk), junked = bag(run).filter((it) => it.junk);
  const mark = (it: Item, on: boolean) => button(on ? "JUNK" : "UNJUNK", (e?: Event) => { e?.stopPropagation(); junk(run, it.uid, on); saveRogue(); go("rparty", undefined, true); }, "sm");
  const wear = (it: Item) => (manage ? () => wearPopup(run, it) : undefined);
  // Any time outside a fight. A party card picked, then someone at camp: they trade places.
  const picked = seatPick !== null ? run.party[seatPick] : null;
  const into = (cls: string) => { if (!picked) return; swap(c, run, picked, cls); seatPick = null; saveRogue(); go("rparty", undefined, true); };
  return [
    header("PARTY", () => { seatPick = null; go("rogue"); }, `ACT ${ROMAN[run.act]}`),
    // The formation's name in its rarity's colour; what its seats' own statuses do, under its text.
    win("", h("div", { class: "line" }, prev, h("span", { class: `grow center ${RARITY_CLASS[formationRarity(c, run.formation)] ?? "hi"}` }, f.name), nxt), h("div", { class: "text dim small wrap" }, f.text, seatNotes(f) ? ` ${seatNotes(f)}` : "")),
    h("div", { class: "cards" }, ...cards),
    supplyRow(run, () => go("rparty", undefined, true)),
    win("scroll",
      section("AT CAMP", `${camp.length}/${seatsOf(c, run)} SEATS`),
      camp.length ? null : h("div", { class: "line dim small" }, "NOBODY AT CAMP"),
      ...camp.map((cls) => {
        const v = vitals(run, cls);
        const stand = !manage ? null
          : picked ? button(`IN FOR ${shortName(picked)}`, (e?: Event) => { e?.stopPropagation(); into(cls); }, "sm hi")
          : run.party.length < rogue(c).config.party ? button("TAKE A SEAT", (e?: Event) => { e?.stopPropagation(); swap(c, run, cls, null); saveRogue(); go("rparty", undefined, true); }, "sm hi")
          : null;
        return h("div", { class: `member${picked ? " target" : ""}`, onClick: () => (picked ? into(cls) : go("runit", cls)) }, faceEl(cls),
          h("div", { class: "stats" }, h("div", { class: "name" }, shortName(cls)), v.ko ? h("div", { class: "bad" }, "KO") : bar(v.hp / v.maxHp), v.maxMp ? bar(v.mp / v.maxMp, "mp") : null),
          stand ?? h("div", { class: "small dim" }, v.maxMp ? h("span", { class: "mp" }, `${disp(v.mp)}/${disp(v.maxMp)}`) : `${disp(v.hp)}/${disp(v.maxHp)}`));
      }),
      section("BAG", `${kept.length} PIECE${kept.length === 1 ? "" : "S"}`),
      ...kept.map((it) => itemRow(run, it, wear(it), { right: manage ? mark(it, true) : null })),
      junked.length ? section("JUNK", "SELL AT A SHOP") : null,
      ...junked.map((it) => junkRow(run, it, wear(it), manage ? mark(it, false) : null)),
    ),
  ];
}

/**
 * A piece in the bag, tapped: the piece, then everyone in the roster who could wear it (the party first), each with what
 * they wear in its slot now and a button to put it on; what they wore goes to the bag. Under a two-handed weapon the
 * offhand is locked; anything else that would come off (an offhand under a two-handed weapon, a second mythic) is named.
 */
function wearPopup(run: RogueRun, it: Item) {
  if (!frameEl) return;
  const frame = frameEl;
  const g = c.gear.get(it.uid) ?? itemGear(c, it);
  const slot = g.slot as Slot;
  const nameOf = (uid: string) => (c.gear.get(uid)?.name ?? uid).toUpperCase();
  const close = () => { box.remove(); nav.overlay = null; };
  const who = [...run.party, ...bench(run)].filter((cls) => canEquip(c.classes.get(cls)!, g));
  const rows = who.map((cls) => {
    const m = member(run, cls);
    const locked = slot === "offhand" && twoHanded(m.gear);
    const now = m.gear[slot] ? itemOf(run, m.gear[slot]!) : undefined;
    const off = comesOff(run, cls, g);
    const put = () => {
      close();
      if (equip(c, run, cls, slot, it.uid)) { saveRogue(); go("rparty", undefined, true); toast(frame, `${shortName(cls)} WEARS ${g.name.toUpperCase()}`); }
    };
    return h("div", { class: "wear" },
      h("div", { class: "line" }, faceEl(cls), h("span", { class: "grow" }, shortName(cls), h("span", { class: "dim small" }, run.party.includes(cls) ? ` · SLOT ${run.party.indexOf(cls) + 1}` : " · CAMP")),
        locked ? null : button(now ? "SWAP" : "EQUIP", put, "sm hi")),
      locked ? lockedRow(slot) : now ? itemRow(run, now, undefined, { stats: fighter(run, cls).stats, right: null, who: false }) : gearRow(null, slot, null),
      locked ? h("div", { class: "line small dim" }, "A TWO-HANDED WEAPON IN HAND") : null,
      off.length ? h("div", { class: "line small dim wrap" }, `${off.map(nameOf).join(", ")} TO THE BAG TOO`) : null,
    );
  });
  const box: HTMLElement = h("div", { class: "overlay dialog", onClick: (e?: Event) => { if (e?.target === box) close(); } },
    win("scroll",
      itemRow(run, it, undefined, { right: null }),
      section("PUT IT ON"),
      ...(rows.length ? rows : [h("div", { class: "line dim small" }, "NOBODY IN THE ROSTER CAN")]),
    ),
    h("div", { class: "btns even" },
      button(it.junk ? "UNJUNK" : "JUNK", () => { close(); junk(run, it.uid, !it.junk); saveRogue(); go("rparty", undefined, true); }),
      button("CLOSE", close)),
  );
  frame.append(box);
  nav.overlay = close;
}

let orderPick: number | null = null;
export function runitScreen(arg?: unknown): Child[] {
  const run = current();
  const cls = String(arg);
  if (!run || !run.roster.some((m) => m.cls === cls)) return rpartyScreen();
  const m = member(run, cls);
  const k = classOf(cls);
  const fm = fighter(run, cls);
  const manage = canManage(run);
  const sp = specialLines(fm.stats);
  const locked = c.classes.get(cls)!.abilities.filter((a) => !m.known.includes(a));
  // A trained ability shows as its form.
  const formAb = (a: string) => c.abilities.get(formOf(m, a)) ?? c.abilities.get(a)!;
  const onN = (i: number) => {
    if (!manage) return;
    if (orderPick === null) orderPick = i;
    else if (orderPick === i) { setOrder(run, cls, m.order.filter((_, j) => j !== i)); orderPick = null; saveRogue(); }
    else { const o = [...m.order]; [o[orderPick], o[i]] = [o[i], o[orderPick]]; setOrder(run, cls, o); orderPick = null; saveRogue(); }
    go("runit", cls, true);
  };
  // Known but left out of fights (a number tapped twice): tapped, it comes back in the last slot.
  const out = m.known.filter((a) => !m.order.includes(a));
  const bringBack = (a: string) => { if (!manage) return; setOrder(run, cls, [...m.order, a]); orderPick = null; saveRogue(); go("runit", cls, true); };
  const v = vitals(run, cls);
  // Any time outside a fight, a party member can step back to camp, and one at camp can be sent home (never the leader).
  const inParty = run.party.includes(cls);
  const move = !manage ? null
    : inParty ? (run.party.length > 1 ? button("TO CAMP", () => { swap(c, run, cls, null); saveRogue(); go("rparty"); }, "sm") : null)
    : cls !== run.leader ? button("SEND HOME", () => confirm(`SEND ${shortName(cls)} HOME?`, "FOR GOOD. ITS GEAR STAYS IN THE BAG.", "SEND HOME", () => { dismiss(c, run, cls); saveRogue(); go("rparty"); }), "sm") : null;
  return [
    header(k.name, () => { orderPick = null; go("rparty"); }, inParty ? h("span", { class: "hi small" }, `SLOT ${run.party.indexOf(cls) + 1}`) : h("span", { class: "dim small" }, "AT CAMP")),
    move ? h("div", { class: "btns" }, move) : null,
    // The run's weapon in hand, not free play's.
    win("", classHead(cls, h("div", { class: "line small" }, v.ko ? h("span", { class: "bad" }, "KO") : h("span", null, `HP ${disp(v.hp)}/${disp(v.maxHp)}`), h("span", { class: "mp" }, `  MP ${disp(v.mp)}/${disp(v.maxMp)}`)), m.gear.weapon)),
    win("", statGrid(fm.stats, k.stats, setup.settings.designer), sp.length ? h("div", { class: "text up small wrap", style: "margin-top:.25rem" }, ...sp.flatMap((s, i) => (i ? [" · ", s] : [s]))) : null),
    win("scroll",
      section("PASSIVE"),
      // A trained passive shows as its form.
      ...classPassive(cls, passiveOf(c, cls) ? formOf(m, passiveOf(c, cls)!) : undefined, fm.stats),
      section("GEAR"),
      // Four slots; under a two-handed weapon the offhand reads locked.
      ...SLOTS.map((s) => {
        if (s === "offhand" && twoHanded(m.gear)) return lockedRow(s);
        const uid = m.gear[s];
        const it = uid ? itemOf(run, uid) : undefined;
        const open = manage ? () => go("rgear", { cls, slot: s }) : undefined;
        if (!it) return gearRow(null, s, fm.stats, open);
        return itemRow(run, it, open, { arrow: !!open, stats: fm.stats, right: null, who: false });
      }),
      canUse(cls),
      section("ABILITIES", manage && orderPick !== null ? h("span", { class: "hi" }, "SWAP · SAME: LEAVE OUT") : null),
      ...m.order.map((a, i) => abilityBlock(formAb(a), fm.stats, { n: i + 1, onN: () => onN(i), cur: orderPick === i, target: orderPick !== null })),
      basicLine(weaponOf(c, fm.weapon), fm.stats, { ref: fm.weapon }),
      out.length ? section("LEFT OUT") : null,
      ...out.map((a) => { const el = abilityBlock(formAb(a), fm.stats); el.classList.add("dimmed"); el.addEventListener("click", () => bringBack(a)); return el; }),
      locked.length ? section("NOT LEARNED YET") : null,
      ...locked.map((a) => { const el = abilityBlock(c.abilities.get(a)!, fm.stats); el.classList.add("dimmed"); return el; }),
    ),
  ];
}

/** A recruit on offer, as a sheet: its class, its passive, what it would join knowing, and what it could learn later. */
export function rclassScreen(arg?: unknown): Child[] {
  const { cls, known } = (arg as { cls: string; known: string[] }) ?? { cls: "", known: [] };
  if (!c.classes.has(cls)) return rogueScreen();
  const k = classOf(cls);
  const later = c.classes.get(cls)!.abilities.filter((a) => !known.includes(a));
  return [
    header(k.name, () => go("rogue")),
    win("scroll", classHead(cls, undefined, plainWeapon(c, cls)), section("PASSIVE"), ...classPassive(cls), section("KNOWS"), ...known.map((a) => abilityBlock(c.abilities.get(a)!, k.stats)),
      later.length ? section("LEARNS LATER") : null, ...later.map((a) => { const el = abilityBlock(c.abilities.get(a)!, k.stats); el.classList.add("dimmed"); return el; })),
  ];
}

export function rgearScreen(arg?: unknown): Child[] {
  const run = current();
  const { cls, slot } = (arg as { cls: string; slot: GearSlot }) ?? {};
  if (!run || !run.roster.some((m) => m.cls === cls)) return rpartyScreen();
  const k = c.classes.get(cls)!;
  const fm = fighter(run, cls);
  const cur = member(run, cls).gear[slot];
  const fits = run.items.filter((it) => { const g = c.gear.get(it.uid) ?? itemGear(c, it); return g.slot === slot && canEquip(k, g); });
  const pick = (uid: string | null) => { equip(c, run, cls, slot, uid); saveRogue(); go("runit", cls); };
  const rarityOrder = { mythic: -1, legendary: 0, rare: 1, uncommon: 2, common: 3 };
  fits.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);
  // What it wears now, then the bag's pieces, then pieces someone else wears, dimmed under their face; taking one of those
  // asks first, so nobody's gear is taken by accident.
  const worn = (it: Item) => { const w = wearer(run, it.uid); return w && w !== cls ? w : null; };
  const row = (it: Item) => {
    const w = worn(it);
    const r = itemRow(run, it, () => (w ? confirm(`TAKE IT FROM ${shortName(w)}?`, `${(c.gear.get(it.uid) ?? itemGear(c, it)).name.toUpperCase()} COMES OFF THE ${shortName(w)}.`, "TAKE IT", () => pick(it.uid)) : pick(it.uid)), { stats: fm.stats, right: w ? h("span", { class: "tag" }, faceEl(w), ` ${shortName(w)}`) : null });
    if (it.uid === cur) r.classList.add("equipped");
    if (w) r.classList.add("dimmed");
    return r;
  };
  const inBag = fits.filter((it) => !wearer(run, it.uid));
  const mine = fits.filter((it) => it.uid === cur), free = inBag.filter((it) => !it.junk), junked = inBag.filter((it) => it.junk), others = fits.filter((it) => worn(it));
  return [
    header(`${shortName(cls)} · ${slot.toUpperCase()}`, () => go("runit", cls)),
    win("list scroll",
      slot !== "weapon" ? h("div", { class: `gear-row${!cur ? " equipped" : ""}`, onClick: () => pick(null) }, h("span", { class: "art" }, ""), h("div", { class: "grow" }, h("div", { class: "line" }, h("span", { class: "dim grow" }, "NOTHING")))) : null,
      ...mine.map(row),
      free.length ? section("IN THE BAG") : null,
      ...free.map(row),
      others.length ? section("WORN BY OTHERS") : null,
      ...others.map(row),
      // Junk last, greyed; put on, it's junk no more.
      junked.length ? section("JUNK") : null,
      ...junked.map((it) => junkRow(run, it, () => pick(it.uid))),
    ),
  ];
}
