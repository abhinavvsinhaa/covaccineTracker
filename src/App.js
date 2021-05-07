import React from 'react';
import './App.css';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      pin: '',
      date: '',
      centers: [],
      center: {
        name: '',
        sessions: []
      },
      session: {
        appt_date: '',
        availability: '',
        min_age: ''
      },
      size: '',
    };
    this.onPinInput = this.onPinInput.bind(this);
    this.onSearchByPin = this.onSearchByPin.bind(this);
  }
  
  onPinInput(event) {
    this.setState({pin: event.target.value});
  }

  onSearchByPin(event) {
    const d = new Date();
    const dt = d.getDate() + "-" + (d.getMonth()+1) + "-" + d.getFullYear();

    this.setState({centers: []});
    console.clear();

    fetch(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${this.state.pin}&date=${dt}%22%20-H%20%22accept:%20application/json%22%20-H%20%22Accept-Language:%20hi_IN`)
    .then(response=>response.json())
    .then(data=>{ 
    
    console.clear();  

    for(var i=0;i<data.centers.length;i++) {

      for(var j=0; j<data.centers[i].sessions.length;j++) {

        this.setState({session: {
          appt_date: data.centers[i].sessions[j].date,
          availability: data.centers[i].sessions[j].available_capacity,
          min_age: data.centers[i].sessions[j].min_age_limit
        }})
        
        this.setState({center: {
          name: data.centers[i].name,
          sessions: [...this.state.center.sessions,this.state.session]
        }})

        this.setState({session: {
          appt_date: '',
          availability: '',
          min_age: ''
        }})
      }

      this.setState({centers: [...this.state.centers,this.state.center]})

      this.setState({center: {
        name: '',
        sessions: []
      }})
    }  
    
    console.log(this.state.centers.map(center => {
      return center;
    }))
      

    })
    .catch(err=>console.log(err))
    event.preventDefault();
  }

  render() {
    return(
      <div className="main">
      <nav class="navbar navbar-light bg-custom">
        <a class="navbar-brand" href="#">
          <h2>Covid Vaccine Tracker</h2>
        </a>
      </nav>
      <div className="forms container-fluid">
        <div className="row gy-4 data">
          <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
            <button className="recover btn btn-success"><h4>Recoveries today: 3,28,334</h4></button>
            <br /><br/>
            <h6 id="disclaimer">Disclaimer: All information is taken as uploaded by Govt. of India & news resources.</h6>
            <br />
            <form onSubmit={this.onSearchByPin} id="pinform">
            <label for="pin">Search by Pin Code</label>
            <br/><br />
            <p>Enter pin code & click on Search to get details about vaccination centers & availability in your area for the next 7 days.</p>
            <input type="text" name="pin" id="pincode" value={this.state.value} onChange={this.onPinInput}/>
            </form>
            <br/>
            <button className="btn btn-primary" type="submit" form="pinform">Search</button>
          </div>
        </div>
        <div className="row gy-3">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">  
          <br/>
          <h6>Developed by <span id="name">Abhinav Sinha</span></h6>
          <br/>
          <table className="table table-bordered table-striped table-success">
            <thead className="thead">
              <tr>
                <th scope="col">S.No</th>
                <th scope="col">Center Name</th>
                <th scope="col">Session Date</th>
                <th scope="col">Min. Age</th>
                <th scope="col">Available Capacity</th>
              </tr>
            </thead>
            <tbody>
              {this.state.centers.map((center,index) => {
                return (
                  <tr>
                    <th scope="row">{index+1}</th>
                    <td style={{fontWeight: '600'}}>{center.name}</td>
                    <td>
                      {center.sessions.map(session=>{
                        return <tr><td>{session.appt_date}</td></tr>;
                      })}
                    </td>
                    <td>
                      {center.sessions.map(session=>{
                        return <tr><td>{session.min_age}</td></tr>;
                      })}
                    </td>
                    <td>
                      {center.sessions.map(session=>{
                        if(Number(session.availability)===0) {
                          return <tr><td style={{color: 'red'}}>{session.availability}</td></tr>;
                        }
                        else {
                        return <tr><td style={{fontWeight: '600'}}>{session.availability}</td></tr>;
                        }
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        </div>
        {/* <a href='https://www.freepik.com/vectors/family'>Family vector created by pikisuperstar - www.freepik.com</a> */}
      </div>
      </div>
    );
  }
}

export default App;
