import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SemanticToast from './semantic-toast';
import { store } from './toast';

/* eslint-disable no-useless-computed-key */
const closeAnimations = {
    ['top-right']: 'fly left',
    ['top-center']: 'fly down',
    ['top-left']: 'fly right',
    ['bottom-right']: 'fly left',
    ['bottom-center']: 'fly up',
    ['bottom-left']: 'fly right'
};

class SemanticToastContainer extends Component {
    static propTypes = {
        position: PropTypes.oneOf([
            'top-right',
            'top-center',
            'top-left',
            'bottom-right',
            'bottom-center',
            'bottom-left'
        ]),
        animation: PropTypes.string,
        className: PropTypes.string
    };

    static defaultProps = {
        position: 'top-right',
        animation: null,
        className: ''
    };

    state = {
        toasts: []
    };

    componentDidMount() {
        store.subscribe(this.updateToasts);
    }

    componentWillUnmount() {
        store.unsubscribe(this.updateToasts);
    }

    onClose = toastId => {
        const toast = this.state.toasts.find(value => value.id === toastId);

        // toast has been removed already, fixes #1
        if (!toast) {
            return;
        }

        store.remove(toast);

        if (toast.onClose) {
            toast.onClose();
        }
    };

    updateToasts = () => {
        this.setState({
            toasts: store.data
        });
    };

    render() {
        const { animation: containerAnimation, position, className } = this.props;
        const { toasts } = this.state;

        return toasts.length ? (
            <div className={`ui-alerts ${position} ${className}`}>
                {this.state.toasts.map(toast => {
                    const {
                        id,
                        type = 'info',
                        title = '',
                        description = '',
                        icon,
                        time,
                        size,
                        color,
                        list,
                        onClick,
                        animation
                    } = toast;
                    return (
                        <SemanticToast
                            key={id}
                            toastId={id}
                            type={type}
                            title={title}
                            description={description}
                            icon={icon}
                            size={size}
                            color={color}
                            list={list}
                            openAnimation={animation || containerAnimation || 'pulse'}
                            closeAnimation={closeAnimations[position]}
                            time={time}
                            onClick={onClick}
                            onClose={this.onClose}
                        />
                    );
                })}
            </div>
        ) : null;
    }
}

export default SemanticToastContainer;
