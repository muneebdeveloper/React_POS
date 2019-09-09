import React, {Component} from 'react';
import Link from '../../lib/ActiveLink';
import Router from 'next/router';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';

import BarcodeNotify from './BarcodeNotify';

import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import DashboardIcon from '@material-ui/icons/Dashboard';
import DirectionsBusIcon from '@material-ui/icons/DirectionsBus';
import CashIcon from '@material-ui/icons/AttachMoney';
import ExpenseIcon from '@material-ui/icons/Assessment';
import BarcodeIcon from '@material-ui/icons/ViewWeek';
import NotificationsIcon from '@material-ui/icons/Notifications';


import SignOut from './SignOut';

import styles from './Header.css';

import CurrentUser from '../CurrentUser';

import NProgress from 'nprogress';
import {StylesProvider} from '@material-ui/styles';

// Router.onRouteChangeStart = ()=>{
//   NProgress.start();
// }

// Router.onRouteChangeComplete = ()=>{
//   NProgress.done();
// }

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

    sideList = side =>{
      let navItems = ['shop','stock','suppliers','sales','expense','notifications','barcodes'];
      let navIcons = [<ShoppingBasketIcon />,<DashboardIcon />,<DirectionsBusIcon />,<CashIcon />,<ExpenseIcon />,<NotificationsIcon />,<BarcodeIcon />];
      return (
        <div
          style={{width:"250px"}}
          role="presentation"
          className="drawerMenuColorHandling"
          onClick={this.toggleDrawer(side, false)}
          onKeyDown={this.toggleDrawer(side, false)}
        >
          <List>
          {
            navItems.map((item,index)=>{
              return(
                  <Link activeClassName="drawerLinkActive" href={item==='shop'?'/':`/${item}`} key={index}>
                    <a style={{textDecoration:'none'}}>
                      <ListItem button>
                        <ListItemIcon>{navIcons[index]}</ListItemIcon>
                        <ListItemText primary={item[0].toUpperCase()+item.slice(1)} />
                      </ListItem>
                    </a>
                  </Link>
              )   
            })
          }
          </List>
       </div>
        );
    } 

   render(){
        return(
            
              <>
            <div className="header">
                <div className="toolbar">


                    <div>
                    <CurrentUser>
                      {
                        ({data})=>{
                          if(data.currentUser){
                            return(
                              <IconButton  color="inherit" aria-label="menu" onClick={this.toggleDrawer('left',true)}>
                                <MenuIcon />
                              </IconButton>
                            )
                          }
                          return null;
                        }
                      }
                    </CurrentUser>
                    </div>
                    
                    <div>
                       <h3>React POS</h3>
                    </div>

                    <div className={styles.logoutGrid}>
                    
                    <CurrentUser>
                      {
                        ({data})=>{
                          
                          if(data.currentUser){
                          return(
                            <>
                              <IconButton  color="inherit" aria-label="menu" className={styles.marginRightButton}>
                                  <Badge badgeContent={0} color="primary">
                                    <NotificationsIcon />
                                  </Badge>
                              </IconButton>

                             <BarcodeNotify /> 
                        
                              <Typography variant="button">Hi, {data.currentUser.username}</Typography>
                              <SignOut />
                            </>
                           )
                        }
                        return null;
                      }
                      }
                    </CurrentUser>
                    
                    
                    
                    </div>


                </div>
            </div>
            <StylesProvider injectFirst>
              <Drawer anchor="left"  open={this.state.left} onClose={this.toggleDrawer('left',false)} >
                  {this.sideList('left')}
              </Drawer>
            </StylesProvider>
            </>
          
        );
   }
   
}

export default Header;