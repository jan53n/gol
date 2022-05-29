import './GridConfig.css';
import { Box, Dialog, DialogContent, Divider, IconButton, List, ListItem, ListItemIcon, Slider, Tooltip } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { zoomTo, setSpeed } from '../store';
import SettingsIcon from '@mui/icons-material/Settings';
import SpeedIcon from '@mui/icons-material/Speed';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { SPEED_MAX, SPEED_MIN, ZOOM_MAX, ZOOM_MIN } from '../config';
import { player } from '../playerSlice';

function GridConfig() {
    const [open, setOpen] = React.useState(false);
    const [zoomOutValue, speedValue] = useSelector(({ zoom, speed }) => [zoom.value, speed.value]);
    const dispatch = useDispatch();

    const openDialog = () => {
        dispatch(player.pause());
        setOpen(true);
    }

    const handleZoomSliderChange = (_e, value) => {
        dispatch(zoomTo(value));
    };

    const handleSpeedSliderChange = (_e, value) => {
        dispatch(setSpeed(value));
    };

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
                            <Box edge="end" sx={{ width: 300 }}>
                                <Slider
                                    edge='end'
                                    aria-label="Speed"
                                    onChange={handleSpeedSliderChange}
                                    min={SPEED_MIN}
                                    max={SPEED_MAX}
                                    value={speedValue}
                                    color="secondary"
                                />
                            </Box>
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemIcon>
                                <ZoomInIcon />
                            </ListItemIcon>
                            <Box edge="end" sx={{ width: 300 }}>
                                <Slider
                                    onChange={handleZoomSliderChange}
                                    min={ZOOM_MIN}
                                    max={ZOOM_MAX}
                                    aria-label="Temperature"
                                    value={zoomOutValue}
                                    color="secondary"
                                />
                            </Box>
                        </ListItem>
                    </List>
                </DialogContent>
            </Dialog>

            <Tooltip title="Configuration">
                <IconButton onClick={openDialog} aria-label="Configuration">
                    <SettingsIcon />
                </IconButton>
            </Tooltip>
        </React.Fragment>
    );
}

export default GridConfig;