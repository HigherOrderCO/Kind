unused skills

flame_ball: App.Kaelin.Skill

  App.Kaelin.Skill.new(
    2#8 // id  - not called anywhere so far
    4   // range - not called anywhere so far
    [App.Kaelin.Skill.Effect.hp(+3#32, App.Kaelin.Skill.Modifier.hp.damage, App.Kaelin.Skill.area.radial(2), some(App.Kaelin.Indicator.red))]
    48#16 // 0
  )

// TODO make it only work if you hit a target
vampirism: App.Kaelin.Skill

  App.Kaelin.Skill.new(
    4#8 // id  - not called anywhere so far
    3   // range - not called anywhere so far
    [
    App.Kaelin.Skill.Effect.hp(+5#32, App.Kaelin.Skill.Modifier.hp.damage, App.Kaelin.Skill.area.single, some(App.Kaelin.Indicator.red)),
    App.Kaelin.Skill.Effect.hp(+5#32, App.Kaelin.Skill.Modifier.hp.heal, App.Kaelin.Skill.area.self, some(App.Kaelin.Indicator.green))]
    48#16 // 0 
  )

earth_root: App.Kaelin.Skill

  App.Kaelin.Skill.new(
    3#8 // id  - not called anywhere so far
    0   // range - not called anywhere so far
    [
    App.Kaelin.Skill.Effect.hp(+20#32, App.Kaelin.Skill.Modifier.hp.heal, App.Kaelin.Skill.area.self, some(App.Kaelin.Indicator.green)),
    App.Kaelin.Skill.Effect.status(+3#32, App.Kaelin.Skill.Modifier.status.root, App.Kaelin.Skill.area.self, none)]
    48#16 // 0 
  )
 
 