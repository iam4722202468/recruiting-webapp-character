export type Attributes = {
    Strength: number;
    Dexterity: number;
    Constitution: number;
    Intelligence: number;
    Wisdom: number;
    Charisma: number;
};

export type Class = "Barbarian" | "Wizard" | "Bard";

export interface CharacterSkill {
    name: string;
    value: number;
}

export interface CharacterAttribute {
    name: string;
    value: number;
}

export interface Character {
  id: number;
  name: string;
  attributes: Array<any>;
  skills: Array<any>;
}