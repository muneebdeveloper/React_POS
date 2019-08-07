import react, {Component} from 'react';

import Intro from '../../misc/Intro';

class Suppliers_ed extends Component{

    render(){
        return(
            <>
                <Intro>Edit / Remove Suppliers</Intro>
                <table>
                    <thead>
                        <tr>
                            <th>Sr#</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Muhammad Muneeb Akhlaq</td>
                            <td>03361707388</td>
                            <td>House#C:66 KAPCO Colony Kot Addu Pakistan</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Muhammad Ali</td>
                            <td>03361707388</td>
                            <td>House#C:66 KAPCO Colony Kot Addu Pakistan ,Jhelum ,india
                            House#C:66 KAPCO Colony Kot Addu Pakistan ,Jhelum ,india
                            </td>
                        </tr>
                    </tbody>
                </table>
            </>
        );
    }
}

export default Suppliers_ed;