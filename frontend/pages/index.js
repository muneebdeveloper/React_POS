import React,{Component} from 'react';
import styles from './index.css';

const Home=()=>{
    return(
        <section class="mainshop">

            <div class={styles.toolbar}>
                <form >
                    <label>
                        Product Code : 
                        <input type="text" autoFocus />
                    </label>
                    <button type="submit" onClick={(e)=>{
                        e.preventDefault();
                        console.log(e);
                    }}>
                        Submit
                        </button>
                    
                </form>
            </div>

        </section>
    );
}

export default Home;