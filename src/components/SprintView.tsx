import React from 'react';
import {style} from "typestyle";
import {Project} from "../interfaces";
import {ItemsView} from "./ItemsView";

const container = style({
  display: 'grid',
  // gridTemplateRows: '100px 200px 300px',
  // gridTemplateColumns: 'repeat(20, 100px)',
});

interface Props {
  projects: Project[];
}

export const SprintView: React.FC<Props> = (props) => {
  const { projects } = props;

  return (
      <div className={container}>
        {projects.map((project, idx) => (
            <React.Fragment key={project.id}>
              <div style={{ gridRow: 1, gridColumn: idx+1, backgroundColor: 'yellow', border: '1px solid black'}}>{project.id}</div>
              <div style={{ gridRow: 2, gridColumn: idx+1, backgroundColor: 'orange', border: '1px solid black'}}>
                <ItemsView items={project.items} parentId={project.id} />
              </div>
            </React.Fragment>
        ))}
      </div>
  );
};
