import { analyse, removeReduntantName } from "./cardAnalysis";




test('Analyses simple card', () => {
  expect(analyse({text: "Foobar"})).toEqual(["DeckSearch"])
});

test('When a value is passed with something between curly brackets and a whitespace before brackets and any associated whitespace is omitted', () => {
  expect(removeReduntantName("Professor's research (Proffesor Sada)")).toEqual("Professor's research")
})

test('When a value is passed with something between curly brackets this is ommited', () => {
  expect(removeReduntantName("Professor's research(Proffesor Sada)")).toEqual("Professor's research")
})



