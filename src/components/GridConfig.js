import './GridConfig.css';
import { Box, Dialog, DialogContent, Divider, IconButton, List, ListItem, ListItemIcon, Slider, Tooltip } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { zoomTo } from '../store';
import SettingsIcon from '@mui/icons-material/Settings';
import SpeedIcon from '@mui/icons-material/Speed';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { ZOOM_MAX, ZOOM_MIN } from '../config';

function GridConfig() {
    const [open, setOpen] = React.useState(false);
    const zoomOutValue = useSelector(state => state.zoom.value);
    const dispatch = useDispatch();
    const handleZoomSliderChange = (_e, value) => {
        dispatch(zoomTo(value));
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
                <IconButton onClick={() => setOpen(true)} aria-label="Configuration">
                    <SettingsIcon />
                </IconButton>
            </Tooltip>
        </React.Fragment>
    );
}

export default GridConfig;