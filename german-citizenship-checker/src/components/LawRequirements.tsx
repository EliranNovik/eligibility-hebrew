import { Box, Typography, Collapse, List, ListItem, ListItemIcon, ListItemText, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { motion } from 'framer-motion';

interface Requirement {
  text: string;
  subtext?: string;
}

interface LawRequirementsProps {
  section: string;
  title: string;
  requirements: Requirement[];
  isOpen: boolean;
  onClose: () => void;
}

const LawRequirements: React.FC<LawRequirementsProps> = ({ section, title, requirements, isOpen, onClose }) => {
  return (
    <Collapse in={isOpen} timeout={500}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            mt: 3,
            p: 3,
            borderRadius: 3,
            background: 'rgba(33, 150, 243, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(33, 150, 243, 0.2)',
          }}
        >
          <Typography variant="h5" fontWeight={700} sx={{ color: '#fff', mb: 2 }}>
            דרישות מסכמות
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.87)', mb: 3 }}>
            {title}
          </Typography>
          
          <List sx={{ mb: 2 }}>
            {requirements.map((req, index) => (
              <ListItem
                key={index}
                sx={{
                  py: 1,
                  px: 2,
                  mb: 1,
                  borderRadius: 2,
                  background: 'rgba(255,255,255,0.05)',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <ListItemIcon>
                  <CheckCircleOutlineIcon sx={{ color: '#2196f3' }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body1" sx={{ color: '#fff', fontWeight: 500 }}>
                      {req.text}
                    </Typography>
                  }
                  secondary={
                    req.subtext && (
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mt: 0.5 }}>
                        {req.subtext}
                      </Typography>
                    )
                  }
                />
              </ListItem>
            ))}
          </List>

          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              color: '#2196f3',
              borderColor: '#2196f3',
              '&:hover': {
                borderColor: '#21cbf3',
                background: 'rgba(33, 150, 243, 0.1)',
              },
            }}
          >
            סגור
          </Button>
        </Box>
      </motion.div>
    </Collapse>
  );
};

export default LawRequirements; 