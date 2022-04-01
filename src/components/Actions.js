import './Actions.css';
import { Badge, Card, IconButton, Toolbar, Tooltip } from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReplayIcon from '@mui/icons-material/Replay';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GridConfig from './GridConfig';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';

function Actions() {
    return (
        <div className='toolbar'>
            <Card>
                <Toolbar>
                    <Tooltip title="Previous">
                        <IconButton aria-label="previous">
                            <SkipPreviousIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Play">
                        <IconButton aria-label="play/pause">
                            <PlayArrowIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Next">
                        <IconButton aria-label="next">
                            <SkipNextIcon />
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
        </div>
    );
}

export default Actions;