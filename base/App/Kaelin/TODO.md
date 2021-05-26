TODO list on Kaelin

- [ ] Add move and abilities to all heroes

- [ ] Remove all non-local user address from when

- [ ] remove user from user_input even in when.kind (URGENT!)

- [ ] App.Kaelin.Event.uset_input needs change

- [ ] App.Kaelin.Constants - randomize or update each build

- [ ] Fix Serialize and Room Constants (acumulating resources and lagging)

- [ ] organize folders, files, and names

- [ ] define tile images in App.Kaelin.Map.arena elsewhere

- [ ] Maybe organize main folder?

- [ ] organize Effect/area/area.kind - Rheidner doing it

- [X] Change from Entity to tile

- [X] Rename state.interface to env_info

- [X] App.Kaelin.move - improve it 

- [X] App.Kaelin - update how movement works 

- [X] App.Kaelin.Draw.background - change hexagon color based on App.Kaelin.CastInfo

- [X] Serialize.kind and Deserialize.kind

- [X] Improve Draw/state/background function

- [X] fix mouse position not corresponding to the respective hexagon

- [X] Change croni, and other heroes to other directory (maybe to resouce hero?)

- [X] consider adding condition and object creation in Effect

- [X] update skill_use

- [X] fix vampirism through conditions on Effects

- [X] CastInfo should go back to none after a movement or after using a skill

- [X] Change croni, and other heroes to othe directory (maybe to resouce hero?)

- [X] Change abilities to other folder than skill/skills. It has to be together with the hero

- [X] Change 'ability' to 'skill'

- [X] Organize map's players functions

- [X] Remove mouse_pos and range from CastInfo and change ability to skill there too

Kind:

- [ ] log inside a function that contains a variable named as 'x' brokes typecheck

- [ ] remove players from state

- [ ] change tile type 

- [ ] change Kaelin State to something like 
  state {
    ativo(game: Kaelin.Game)
    menu(init: Kaelin.Init) // escolher os personagens e tudo mais
  }

- [ ] choose name for ativo in Kaelin.State

- [ ] add turninfo? or add turn in Kaelin.Internal?

- [ ] choose system points

- [ ] choose system priority

- [X] I32.show bug (when printing negative numbers goes to 2ˆ32 - absolute value) 

- [ ] Remodel all draw functions
