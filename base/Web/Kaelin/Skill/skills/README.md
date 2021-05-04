unused skills

flame_ball: Web.Kaelin.Skill

  Web.Kaelin.Skill.new(
    2#8 // id  - not called anywhere so far
    4   // range - not called anywhere so far
    [Web.Kaelin.Skill.Effect.hp(+3#32, Web.Kaelin.Skill.Modifier.hp.damage, Web.Kaelin.Skill.area.radial(2), some(Web.Kaelin.Skill.area.indicator.red))]
    48#16 // 0
  )

// TODO make it only work if you hit a target
vampirism: Web.Kaelin.Skill

  Web.Kaelin.Skill.new(
    4#8 // id  - not called anywhere so far
    3   // range - not called anywhere so far
    [
    Web.Kaelin.Skill.Effect.hp(+5#32, Web.Kaelin.Skill.Modifier.hp.damage, Web.Kaelin.Skill.area.single, some(Web.Kaelin.Skill.area.indicator.red)),
    Web.Kaelin.Skill.Effect.hp(+5#32, Web.Kaelin.Skill.Modifier.hp.heal, Web.Kaelin.Skill.area.self, some(Web.Kaelin.Skill.area.indicator.green))]
    48#16 // 0 
  )

earth_root: Web.Kaelin.Skill

  Web.Kaelin.Skill.new(
    3#8 // id  - not called anywhere so far
    0   // range - not called anywhere so far
    [
    Web.Kaelin.Skill.Effect.hp(+20#32, Web.Kaelin.Skill.Modifier.hp.heal, Web.Kaelin.Skill.area.self, some(Web.Kaelin.Skill.area.indicator.green)),
    Web.Kaelin.Skill.Effect.status(+3#32, Web.Kaelin.Skill.Modifier.status.root, Web.Kaelin.Skill.area.self, none)]
    48#16 // 0 
  )
 
 