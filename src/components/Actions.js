import './Actions.css';
import { Badge, Card, IconButton, Toolbar, Tooltip } from "@mui/material";
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReplayIcon from '@mui/icons-material/Replay';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GridConfig from './GridConfig';

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

export default Actions;