import React, {Component} from 'react';

import Drawer from '@material-ui/core/Drawer';

import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import styles from './Header.css';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';


class Header extends Component{

    state={
        left:false
    }

    toggleDrawer = (side,open)=> event =>{

        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
          }
      

        this.setState({
            [side]:open
        });
    }

    sideList = side => (
        <div
          style={{width:"250px"}}
          role="presentation"
          onClick={this.toggleDrawer(side, false)}
          onKeyDown={this.toggleDrawer(side, false)}
        >
            {/* <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List> */}

      <nav>
            <ul className={styles.linkitems}>
                <li><a href="/">Shop</a></li>
                <li><a href="/">Stock</a></li>
                <li><a href="/">Sales</a></li>
                <li><a href="/">Settings</a></li>
           </ul>
        </nav>
       </div>
        );

   render(){
        return(
            <>
            <div class="header">
                <div class="toolbar">


                    <div>
                        <IconButton  color="inherit" aria-label="menu" onClick={this.toggleDrawer('left',true)}>
                            <MenuIcon />
                        </IconButton>
                    </div>
                    
                    <div>
                       <h3>React POS</h3>
                    </div>

                    <div>
                    <IconButton  color="inherit" aria-label="menu">
                        <Badge badgeContent={11} color="secondary">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    </div>


                </div>
            </div>

            <Drawer anchor="left"  open={this.state.left} onClose={this.toggleDrawer('left',false)} >
                {this.sideList('left')}
            </Drawer>
            </>
        );
   }
   
}

export default Header;