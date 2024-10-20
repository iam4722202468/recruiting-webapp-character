import React, { useState } from 'react';
import { Character, CharacterAttribute } from '../types';
import { SKILL_LIST, CLASS_LIST } from '../consts';

function calculateSkillPoints(intelligence: number): number {
    return calculateModifier(intelligence) * 4 + 10;
}

function calculateModifier(value: number): number  {
    return Math.floor((value - 10) / 2);
}

function findModifier(name: string): string {
    return SKILL_LIST.filter(skill => skill.name === name)[0]?.attributeModifier || '';
}

function findSkillValue(attributes: Array<CharacterAttribute>, name: string): number {
    const attributeModifier = findModifier(name);
    const attributeValue = attributes.find(a => a.name === attributeModifier)?.value || 10;
    return calculateModifier(attributeValue);
}

function CharacterSkills({ skills, attributes, setSkills }) {
    const intelligencePoints = attributes.find(a => a.name === 'Intelligence')?.value || 10;
    const points = skills.reduce((sum: number, s: any) => sum - s.value, calculateSkillPoints(intelligencePoints));

    function increaseSkill(skillName, value) {
        setSkills(skills.map(s => {
            if (s.name === skillName) {
                return {
                    ...s,
                    value: s.value + value
                }
            } else {
                return s;
            }
        }));
    }

    function computeTotal({ name, value }): number {
        return findSkillValue(attributes, name) + value
    }

    return (
        <div>
            <h1>Skills</h1>
            <div>({ points } points remaining)</div>
            <hr/>
            {
                skills.map(skill => (
                    <div key={ skill.name }>
                        <div>{ skill.name } - points: { skill.value }
                            <button onClick={() => increaseSkill(skill.name, 1)}>+</button>
                            <button onClick={() => increaseSkill(skill.name, -1)}>-</button>
                            Modifier: ({ findModifier(skill.name) }) { findSkillValue(attributes, skill.name) } | Total: { computeTotal(skill) }
                        </div>
                    </div>
                ))
            }
        </div>
    );
}

function CharacterAttributes({ attributes, setAttributes }) {
    const points = attributes.reduce((sum, a) => sum - a.value, 70);

    function increaseAttribute(attributeName, value) {
        if (points - value < 0) {
            alert('Not enough attribute points');
            return;
        }

        setAttributes(attributes.map(a => {
            if (a.name === attributeName) {
                return {
                    ...a,
                    value: a.value + value
                }
            } else {
                return a;
            }
        }));
    }

    return (
        <div>
            <h1>Attributes</h1>
            <div>({points} points remaining)</div>
            <hr/>
            {
                attributes.map(attribute => (
                    <div key={ attribute.name }>
                        <div>{ attribute.name } { attribute.value } (Modifier: { calculateModifier(attribute.value) })
                            <button onClick={() => increaseAttribute(attribute.name, 1)}>+</button>
                            <button onClick={() => increaseAttribute(attribute.name, -1)}>-</button>
                        </div>
                    </div>
                ))
            }
        </div>
    );
}

function Classes({ attributes }) {
    let [selectedClass, setSelectedClass] = useState('');

    function onClassClick(className) {
        setSelectedClass(className);
    }

    return (
        <div>
            <h1>Classes</h1>
            <hr/>
            {
                Object.keys(CLASS_LIST).map((className) => (
                    <div key={className} onClick={() => onClassClick(className)}>
                        <h2>{ className }</h2>
                        { className === selectedClass &&
                            <ul>
                                {
                                    Object.keys(CLASS_LIST[className]).map((attribute) => (
                                        <li key={attribute} style={{
                                            color: (attributes.find(attribute_ => attribute_.name === attribute)?.value || 0) >= CLASS_LIST[className][attribute] ? 'green' : 'red'
                                        }}>
                                            { attribute }: { CLASS_LIST[className][attribute] }
                                        </li>
                                    ))
                                }
                            </ul>
                        }
                    </div>
                ))
            }
        </div>
    )
}

function SkillCheck({ attributes, skills }) {
    let [selectedSkill, setSelectedSkill] = useState('Acrobatics');
    let [dc, setDc] = useState(20);
    let [result, setResult] = useState(null);

    function roll() {
        const skill = skills.find(s => s.name === selectedSkill)?.value || 0;
        const attributeModifier = findModifier(selectedSkill);
        const attributeValue = attributes.find(a => a.name === attributeModifier)?.value || 10;

        const total = skill + calculateModifier(attributeValue);
        const random = Math.floor(Math.random() * 20) + 1;

        setResult({
            total,
            random,
            success: total >= random
        })
    }

    return (
        <div>
            <h1>Skill Check</h1>

            { result && (
                <div>
                    <p>Roll: { result.random }</p>
                    <p>Skill ({ selectedSkill }): { result.total }</p>
                    <h2>Result: { result.success ? 'Success' : 'Failure' }</h2>
                </div>
            )}

            <div className="characterSheet">
                <select onChange={(e) => {
                    setSelectedSkill(e.target.value)
                    setResult(null)
                }} name="skills">
                    {
                        skills.map(skill => (
                            <option key={skill.name} value={skill.name}>{ skill.name }</option>
                        ))
                    }
                </select> 

                <input type="number" onChange={(e) => setDc(parseInt(e.target.value)) } value={dc}/>
                <button onClick={roll}>Roll</button>
            </div>
        </div>
    );
}

export default function CharacterSheet({ character, setSkills, setAttributes, children } : { character: Character, setSkills: any, setAttributes: any, children: any }) {
    return (
        <>
            <h1>Character Sheet { character.name }</h1>

            <SkillCheck attributes={character.attributes} skills={character.skills} />
            <div className="Character-sheet">
                <CharacterAttributes attributes={character.attributes} setAttributes={setAttributes} />
                <Classes attributes={character.attributes}></Classes>
                <CharacterSkills attributes={character.attributes} skills={character.skills} setSkills={setSkills} />
            </div>

            { children }
        </>
    );
}