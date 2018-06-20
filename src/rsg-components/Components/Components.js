import React from 'react';
import PropTypes from 'prop-types';
import ReactComponent from 'rsg-components/ReactComponent';
import ComponentsRenderer from 'rsg-components/Components/ComponentsRenderer';

const viewProps = [
	'border',
	'display',
	'feedback',
	'inverse',
	'marginHorizontal',
	'marginVertical',
	'offsetBottom',
	'offsetLeft',
	'offsetRight',
	'offsetTop',
	'paddingHorizontal',
	'paddingVertical',
	'position',
	'scene',
	'tag',
	'textAlign',
	'verticalAlign',
];
const html = {
	name: '...html attributes',
	description: 'HTML标准属性',
	type: {
		name: 'link',
		target: 'blank',
		href: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes',
		text: 'HTML Standard Attributes',
	},
};
const view = {
	name: '...view props',
	description: 'view标签所有属性',
	type: { name: 'link', href: '#view', text: 'ViewProps' },
};

export default function Components({ components, depth }) {
	components.forEach(component => {

		if (component.name !== 'View') {
			const props = [html, view];
			component.props.props.forEach(prop=> {
				if (viewProps.includes(prop.name)) {
					if (!prop.defaultValue) {
						return;
					}
					const prefix = `覆盖<a href="#view">ViewProps</a>默认值`;
					if (prop.description.indexOf(prefix) === -1) {
						prop.description  = `覆盖<a href="#view">ViewProps</a>默认值，${prop.description}`;
					}
				}
				props.push(prop);
			});
			component.props.props = props;
		} else {
			component.props.props = [html, ...component.props.props];
		}
	});
	return (
		<ComponentsRenderer>
			{components.map(component => (
				<ReactComponent key={component.filepath} component={component} depth={depth} />
			))}
		</ComponentsRenderer>
	);
}

Components.propTypes = {
	components: PropTypes.array.isRequired,
	depth: PropTypes.number.isRequired,
};
