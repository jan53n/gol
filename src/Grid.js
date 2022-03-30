import './Grid.css';
import './Cell.css';
import './Actions.css';
import { Badge, Box, Card, Divider, IconButton, List, ListItem, ListItemIcon, Slider, Toolbar, Tooltip } from '@mui/material';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReplayIcon from '@mui/icons-material/Replay';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SettingsIcon from '@mui/icons-material/Settings';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import SpeedIcon from '@mui/icons-material/Speed';
import ZoomInIcon from '@mui/icons-material/ZoomIn';

import React from 'react';

function Cell() {
    return (
        <React.Fragment>
            <div className='cell'></div>
        </React.Fragment>
    );
}

function CellList() {
    return Array.from({ length: 10000 }, () => <Cell></Cell>);
}

function GridConfig() {
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogContent>
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <SpeedIcon />
                            </ListItemIcon>
                            <Box sx={{ width: 300 }}>
                                <Slider
                                    aria-label="Temperature"
                                    defaultValue={30}
                                    color="secondary"
                                />
                            </Box>
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemIcon>
                                <ZoomInIcon />
                            </ListItemIcon>
                            <Box sx={{ width: 300 }}>
                                <Slider
                                    aria-label="Temperature"
                                    defaultValue={30}
                                    color="secondary"
                                />
                            </Box>
                        </ListItem>
                        <Divider />
                    </List>
                </DialogContent>
            </Dialog>

            <Tooltip title="Configuration">
                <IconButton onClick={() => setOpen(true)} aria-label="Configuration">
                    <SettingsIcon />
                </IconButton>
            </Tooltip>
        </React.Fragment>
    );
}

function Actions() {
    return (
        <Card className='toolbar'>
            <Toolbar>
                <Tooltip title="Play">
                    <IconButton aria-label="play/pause">
                        <PlayArrowIcon />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Undo">
                    <IconButton aria-label="undo">
                        <UndoIcon />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Redo">
                    <IconButton aria-label="redo">
                        <RedoIcon />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Reset">
                    <IconButton aria-label="reset">
                        <ReplayIcon />
                    </IconButton>
                </Tooltip>

                <GridConfig />

                <div style={{ marginLeft: 'auto', paddingRight: '12px' }}>
                    <Badge badgeContent={4} color="primary">
                        <AccessTimeIcon />
                    </Badge>
                </div>
            </Toolbar>
        </Card>
    );
}

function Grid() {
    return (
        <React.Fragment>
            <div className='grid' style={{ gridTemplateColumns: `repeat(${100}, 50px)`, gridTemplateRows: `repeat(${100}, 50px)`, }}>
                <CellList></CellList>
            </div>

            <Actions></Actions>
        </React.Fragment>
    );
}

export default Grid;