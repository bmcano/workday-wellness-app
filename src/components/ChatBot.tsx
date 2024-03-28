import React, { useState } from 'react';
import Button from "@mui/material/Button";
import Drawer from '@mui/material/Drawer';

const ChatBot: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className="footer">
      <Button variant="contained" color="primary" onClick={handleDrawerOpen}>Talk with the Workday Wellness Assistant</Button>
      <Drawer anchor="right" open={open} onClose={handleDrawerClose}>
        <div dangerouslySetInnerHTML={{
          __html: `<iframe id="UTUFTPWDEN" loading="eager" src="https://embed.pickaxeproject.com/axe?id=Workday_Wellness_Assistant_LGKZX&mode=embed_gold&host=beta&theme=custom&opacity=100&font_header=Real+Head+Pro&size_header=30&font_body=Real+Head+Pro&size_body=16&font_labels=Real+Head+Pro&size_labels=14&font_button=Real+Head+Pro&size_button=16&c_fb=&c_ff=F01716&c_fbd=F01716&c_bb=F01716&c_bt=FFFFFF&c_t=000000&s_ffo=100&s_bbo=100&s_f=minimalist&s_b=filled&s_t=2&s_to=1&s_r=2" width="100%" height="850px" onMouseOver="this.style.boxShadow='0px 6px 6px -3px rgba(0,0,0,0.1)'" onMouseOut="this.style.boxShadow='none'" style="border:1px solid rgba(0, 0, 0, 1);transition:.3s;border-radius:4px;" frameBorder="0"></iframe>`
        }} />
        <Button onClick={handleDrawerClose} color="primary">Close</Button>
      </Drawer>
    </div>
  );
};

export default ChatBot;