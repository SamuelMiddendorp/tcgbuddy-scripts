import { analyse } from "./cardAnalysis";




test('Analyses simple card', () => {
  expect(analyse({text: "Foobar"})).toEqual(["DeckSearch"])
});

