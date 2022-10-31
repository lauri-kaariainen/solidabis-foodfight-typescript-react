export interface ICharacter {
  name: string;
  hp: number;
  attackPower: number;
  defencePower: number;
  fats: number;
  delay: number;
}
/*
"Valuelist":[16.492,1248.6,21,11],
"Desclist":"hiilihydraatti,energia, laskennallinen,rasva,proteiini"*/

export const createCharacter = (stats: any): ICharacter => ({
  name: stats.name,
  hp: +(stats.Valuelist[1] * 0.239006), //stats.energyKcal (kcal = 0.239006*joule)
  attackPower: +stats.Valuelist[0], //stats.carbohydrates
  defencePower: +stats.Valuelist[3], //stats.protein,
  fats: +stats.Valuelist[2], //stats.fat,
  delay: +(
    stats.Valuelist[0] +
    stats.Valuelist[2] +
    stats.Valuelist[3]
  ).toFixed(2)
});
