import './App.style.sass';

import ArrowIcon from '@img/arrow.svg';
import MenuIcon from '@img/menu.svg';
import ShareIcon from '@img/share.svg';
import { observer } from 'mobx-react-lite';
import { memo } from 'react';

import { ManagementButton } from './components/ManagementButton';
import { ProjectTable } from './components/ProjectTable';
import ProjectTile from './components/ProjectTile/ProjectTile';
import { Tab } from './components/Tab';

export const PROJECTS: string[] = [
	'По проекту',
	'Объекты',
	'РД',
	'МТО',
	'СМР',
	'График',
	'МиМ',
	'Рабочие',
	'Капвложения',
	'Бюджет',
	'Финансирование',
	'Панорамы',
	'Камеры',
	'Поручения',
	'Контрагенты',
];

export default memo(
	observer(function App() {
		return (
			<>
				<div className="management">
					<ManagementButton content={<img src={MenuIcon} alt="Иконка меню" />} />
					<ManagementButton
						content={<img src={ShareIcon} alt="Иконка поделиться" />}
					/>
					<ManagementButton content={<p>Просмотр</p>} isSelect />
					<ManagementButton content={<p>Управление</p>} />
				</div>
				<div className="work-area">
					<div className="work-area__projects">
						<div className="work-area__projects-search">
							<div>
								<input
									type="text"
									name="name-project"
									placeholder="Название проекта"
								/>
								<input
									type="text"
									name="abbreviation"
									placeholder="Аббревиатура"
								/>
							</div>
							<button>
								<img src={ArrowIcon} alt="Иконка стрелки" />
							</button>
						</div>
						<div className="work-area__projects-tiles">
							{PROJECTS.map((p, i) => {
								return (
									<ProjectTile
										key={`${i}-${p}`}
										name={p}
										isSelect={p === 'СМР'}
									/>
								);
							})}
						</div>
					</div>
					<div className="work-area__project">
						<div className="work-area__project-tabs">
							<Tab title="Строительно-монтажные работы" />
						</div>
						<ProjectTable />
					</div>
				</div>
			</>
		);
	}),
);
