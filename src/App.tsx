import React, {Dispatch} from 'react';
import {SprintView} from "./components/SprintView";
import {useProjects} from "./hooks/useProjects";
import {Project} from "./interfaces";
import { AnyAction } from 'redux';

interface ProjectContextIf {
    projects: Project[];
    dispatch: Dispatch<AnyAction>;
}

export const ProjectContext = React.createContext<ProjectContextIf>({projects: [], dispatch: () => null});

const App: React.FC = () => {
  const [{projects}, dispatch] = useProjects();

  return (
      <ProjectContext.Provider value={{projects, dispatch}}>
          <SprintView projects={projects} />
      </ProjectContext.Provider>
  );
};

export default App;
