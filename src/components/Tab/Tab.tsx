import './Tab.style.sass';

interface ITab {
	title: string;
}

export default function Tab({ title }: ITab) {
	return (
		<div className='tab'>
			<p>{title}</p>
		</div>
	);
}
