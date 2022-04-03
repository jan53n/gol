import './Actions.css';
import { Badge, Card, IconButton, Toolbar, Tooltip } from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReplayIcon from '@mui/icons-material/Replay';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GridConfig from './GridConfig';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PLAYER_NEXT, PLAYER_PAUSE, PLAYER_PLAY, PLAYER_PREV, PLAYER_RESET } from '../config';
import { setPlayerState } from '../store';

function PlayPauseIcon({ playing, ...otherProps }) {
    return (playing ? <PauseIcon {...otherProps} /> : <PlayArrowIcon {...otherProps} />);
}

function Actions() {
    const dispatch = useDispatch();
    const playing = useSelector((store) => store.player.state === PLAYER_PLAY);

    const handlePlayClick = (e) => {
        const state = playing ? PLAYER_PAUSE : PLAYER_PLAY;
        dispatch(setPlayerState(state));
    };

    const handleNextClick = (e) => {
        dispatch(setPlayerState(PLAYER_NEXT));
    };

    const handlePreviousClick = (e) => {
        dispatch(setPlayerState(PLAYER_PREV));
    };

    const handleResetClick = (e) => {
        dispatch(setPlayerState(PLAYER_RESET));
    };

    const playPauseText = playing ? "Pause" : "Play";

    return (
        <div className='toolbar'>
            <Card>
                <Toolbar>
                    <Tooltip title="Previous">
                        <IconButton onClick={handlePreviousClick} aria-label="previous">
                            <SkipPreviousIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={playPauseText}>
                        <IconButton onClick={handlePlayClick} aria-label="play/pause">
                            <PlayPauseIcon playing={playing} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Next">
                        <IconButton onClick={handleNextClick} aria-label="next">
                            <SkipNextIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Reset">
                        <IconButton onClick={handleResetClick} aria-label="reset">
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
        </div>
    );
}

export default Actions;