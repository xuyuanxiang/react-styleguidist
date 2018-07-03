import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import Preview from 'rsg-components/Preview';
import Para from 'rsg-components/Para';
import Slot from 'rsg-components/Slot';
import PlaygroundRenderer from 'rsg-components/Playground/PlaygroundRenderer';
import { EXAMPLE_TAB_CODE_EDITOR } from '../slots';
import { DisplayModes } from '../../consts';

function camelCase (tag) {
	return tag.replace(tag.charAt(0),
		tag.charAt(0).toUpperCase()).
		replace(/-([a-z])/g, ($1, $2) => $2.toUpperCase());
}

export default class Playground extends Component {
	static propTypes = {
		code: PropTypes.string.isRequired,
		evalInContext: PropTypes.func.isRequired,
		index: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
		settings: PropTypes.object,
	};

	static contextTypes = {
		config: PropTypes.object.isRequired,
		displayMode: PropTypes.string,
	};

	constructor(props, context) {
		super(props, context);
		const { code, settings } = props;
		const { config } = context;
		const showCode = settings.showcode !== undefined ? settings.showcode : config.showCode;

		this.state = {
			code,
			activeTab: showCode ? EXAMPLE_TAB_CODE_EDITOR : undefined,
		};

		this.handleTabChange = this.handleTabChange.bind(this);
		this.handleChange = debounce(this.handleChange.bind(this), config.previewDelay);
	}

	componentWillReceiveProps(nextProps) {
		const { code } = nextProps;
		this.setState({
			code,
		});
	}

	componentWillUnmount() {
		// Clear pending changes
		this.handleChange.cancel();
	}

	handleChange(code) {
		this.setState({
			code,
		});
	}

	handleTabChange(name) {
		this.setState(state => ({
			activeTab: state.activeTab !== name ? name : undefined,
		}));
	}

	render() {
		const { code, activeTab } = this.state;
		const { evalInContext, index, name, settings } = this.props;
		const { displayMode } = this.context;
		const sourceCode = code.replace(/<\/?(\w+-?\w+)\s*>?/g,
			($1, $2) => $1.replace(new RegExp($2, 'g'), camelCase($2)));
		const preview = <Preview code={`<div style="background: #f5f5f5;margin:0;padding:0">${sourceCode}</div>`} evalInContext={evalInContext} />;
		if (settings.noeditor) {
			return <Para>{preview}</Para>;
		}
		return (
			<PlaygroundRenderer
				name={name}
				preview={preview}
				previewProps={settings.props || {}}
				tabButtons={
					<Slot
						name="exampleTabButtons"
						active={activeTab}
						props={{ onClick: this.handleTabChange }}
					/>
				}
				tabBody={
					<Slot
						name="exampleTabs"
						active={activeTab}
						onlyActive
						props={{ code, onChange: this.handleChange, evalInContext }}
					/>
				}
				toolbar={
					<Slot
						name="exampleToolbar"
						props={{ name, isolated: displayMode === DisplayModes.example, example: index }}
					/>
				}
			/>
		);
	}
}
