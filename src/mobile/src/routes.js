import Home from './App/Home.react';
// components
import ActionButton from './Shared/Material/ActionButton';
import ActionButtonToolbar from './Shared/Material/ActionButton/ActionButtonToolbar.react';
import ActionButtonSpeedDial from './Shared/Material/ActionButton/ActionButtonSpeedDial.react';
import Avatar from './Shared/Material/Avatar';
import BottomNavigation from './Shared/Material/BottomNavigation';
import Badge from './Shared/Material/Badge';
import Button from './Shared/Material/Button';
import Card from './Shared/Material/Card';
import Checkbox from './Shared/Material/Checkbox';
import Dialog from './Shared/Material/Dialog';
import Drawer from './Shared/Material/Drawer';
import IconToggle from './Shared/Material/IconToggle';
import List from './Shared/Material/List';
import RadioButton from './Shared/Material/RadioButton';
import Toolbar from './Shared/Material/Toolbars';

export default {
    home: {
        title: 'Select component',
        Page: Home,
    },
    actionButton: {
        title: 'Action buttons',
        Page: ActionButton,
    },
    actionButtonToolbar: {
        title: 'Toolbar transition',
        Page: ActionButtonToolbar,
    },
    actionButtonSpeedDial: {
        title: 'Speed dial transition',
        Page: ActionButtonSpeedDial,
    },
    avatar: {
        title: 'Avatars',
        Page: Avatar,
    },
    badge: {
        title: 'Badge',
        Page: Badge,
    },
    bottomNavigation: {
        title: 'Bottom navigation',
        Page: BottomNavigation,
    },
    button: {
        title: 'Buttons',
        Page: Button,
    },
    card: {
        title: 'Cards',
        Page: Card,
    },
    checkbox: {
        title: 'Checkboxes',
        Page: Checkbox,
    },
    dialog: {
        title: 'Dialogs',
        Page: Dialog,
    },
    drawer: {
        title: 'Drawer',
        Page: Drawer,
    },
    iconToggle: {
        title: 'Icon toggles',
        Page: IconToggle,
    },
    list: {
        title: 'List items',
        Page: List,
    },
    radioButton: {
        title: 'Radio buttons',
        Page: RadioButton,
    },
    toolbar: {
        title: 'Toolbars',
        Page: Toolbar,
    },
};
