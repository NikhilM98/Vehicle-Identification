import React from 'react';
import FetchApi from '../utils/FetchAPI';

export default class AddVehicle extends React.Component {
    constructor() {
        super();
        this.state = {
            vehicleNo:'',
            status: ''
        }
    }

    onChange = (e) => {
        const name = e.target.name
        let value = e.target.value
        this.setState ({
            [name]: value
        })
    }

    onSubmit = (e) => {
        e.preventDefault()
        let data = {
            number: this.state.vehicleNo
        }
        if(data) {
            FetchApi('Post', '/api/vehicle/add', data)
                .then(r => {
                    if(r && r.data && r.data.body) {
                        this.setState({status: "Vehicle Added"})
                    }
                })
                .catch(err => {
                    this.setState({status: err.msg})
                })
        }

    }

    render() {
        return (
            <div>
                Add Vehicle
                <form onSubmit={this.onSubmit}>
                    <input type="text" name="vehicleNo" onChange={this.onChange} value={this.state.vehicleNo}/>
                    <input type="submit" />
                </form>
                {this.state.status}
            </div>
        );
        }
}
