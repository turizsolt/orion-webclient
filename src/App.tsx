import React from 'react';
import {SprintView} from "./components/SprintView";
import {Project} from "./interfaces";

const json:Project[] = [
  {
    id: 'ORI',
    name: 'Orion',
    items: [
      {
        id: '1',
        name: 'Token processor',
        state: 'todo',
        items: [
          {
            id: '2',
            name: 'Define tokens',
            state: 'done',
          },
          {
            id: '3',
            name: 'Implement',
            state: 'doing',
          },
        ],
      },
      {
        id: '4',
        name: 'Sprint UI',
        state: 'todo',
        items: [
          {
            id: '5',
            name: 'Project json',
            state: 'done',
            items: [
              {
                id: '5',
                name: 'Project json',
                state: 'done',
              },
            ],
          },
          {
            id: '6',
            name: 'Sprint bar',
            state: 'doing',
          },
        ],
      },
    ],
  },
  {
    id: 'JUR',
    name: 'Jurta',
    items: [
      {
        id: '7',
        name: 'Specifikálni',
        state: 'todo',
      },
      {
        id: '8',
        name: 'Megcsinálni',
        state: 'todo',
        items: [
          {
            id: '9',
            name: 'Alaposabban',
            state: 'done',
          },
        ],
      },
    ],
  },
];

const App: React.FC = () => {
  return (
    <SprintView projects={json} />
  );
};

export default App;
