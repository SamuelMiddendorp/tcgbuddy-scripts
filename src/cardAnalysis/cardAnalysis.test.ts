import { analyse, removeReduntantName } from "./cardAnalysis";




test('Analyses simple card', () => {
  expect(analyse({text: "Foobar"})).toEqual(["DeckSearch"])
});

test('Regex to clean up reduntant name', () => {
  expect(removeReduntantName("Professor's research (Proffesor Sada)")).toEqual("Professor's research")
})



