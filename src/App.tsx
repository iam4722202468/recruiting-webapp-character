import { useState } from 'react';
import './App.css';
import { ATTRIBUTE_LIST, SKILL_LIST, GITHUB_USER } from './consts';
import { Character, CharacterAttribute, CharacterSkill } from './types';

import CharacterSheet from './components/CharacterSheet';

function createNewCharacter(id: number) {
  return {
    id,
    name: 'Character: ' + id,
    attributes: ATTRIBUTE_LIST.map((attribute) => ({ name: attribute, value: 10 })),
    skills: SKILL_LIST.map((skill) => ({ name: skill.name, value: 0 }))
  }
}

function saveCharacters(characters: Array<Character>) {
  const endpoint = `https://recruiting.verylongdomaintotestwith.ca/api/{${GITHUB_USER}}/character`;

  fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(characters)
  })
    .then(response => response.json())
    .then(() => alert('Data saved successfully!'))
    .catch(error => console.error(error));
}

function getCharacters(): Promise<Array<Character>> {
  const endpoint = `https://recruiting.verylongdomaintotestwith.ca/api/{${GITHUB_USER}}/character`;

  return fetch(endpoint)
    .then(response => response.json())
    .then(data => data.body)
    .catch(error => console.error(error))
    .finally(() => alert('Data loaded successfully!'));
}

function App() {
  const initialCharacters = [createNewCharacter(0)]

  const [lastId, setLastId]: [lastId: number, setLastId: any] = useState(0);
  const [characters, updateCharacters]: [characters: Array<Character>, updateCharacters: any] = useState(initialCharacters);

  function addNewCharacter() {
    setLastId(lastId + 1);
    updateCharacters([...characters, createNewCharacter(lastId + 1)]);
  }

  function setSkills(characterId: number, newSkills: Array<CharacterSkill>) {
    updateCharacters(characters.map(character => {
      if (character.id === characterId) {
        return {
          ...character,
          skills: newSkills
        }
      } else {
        return character;
      }
    }));
  }

  function setAttributes(characterId: number, newAttributes: Array<CharacterAttribute>) {
    updateCharacters(characters.map(character => {
      if (character.id === characterId) {
        return {
          ...character,
          attributes: newAttributes
        }
      } else {
        return character;
      }
    }));
  }

  function removeCharacter(characterId: number) {
    updateCharacters(characters.filter(character => character.id !== characterId));
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise</h1>
      </header>
      <section className="App-section">
        <h2>Characters</h2>
        <div>
          <button onClick={() => saveCharacters(characters)}>Save Characters</button>
          <button onClick={() => getCharacters().then((data) => updateCharacters(data))}>Load Characters</button>
        </div>

        <div>
          <button onClick={addNewCharacter}>New Character</button>
        </div>
        <div>
          {
            characters.map((character) => (
              <CharacterSheet key={character.id}
                  character={character}
                  setSkills={(newSkills: Array<CharacterSkill>) => setSkills(character.id, newSkills)}
                  setAttributes={(newAttributes: Array<CharacterAttribute>) => setAttributes(character.id, newAttributes)}>
                <button onClick={() => removeCharacter(character.id)}>Remove Character</button>
              </CharacterSheet>
            ))
          }
        </div>
      </section>
    </div>
  );
}

export default App;