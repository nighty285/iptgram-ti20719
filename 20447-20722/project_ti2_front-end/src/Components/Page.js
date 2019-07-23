import React from 'react';
import {Posts} from './Posts';
import {Details} from './Details';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


export class Page extends React.Component {
    //construtor
    constructor(props) {
        super(props);
  
        this.state = {
            postsArr : [], //array de posts que faz parte do state da Page
            search : ""    //string usada para guardar o valor da caixa de pesquisa
        };
              
    }



    //Método executado logo após o componente ter sido montado
    //Chama a função que usa a string do state para fazer o pedido de posts à API
    componentDidMount(){
        this.handleSearch(this.state.search);
    }

    //Função que usa a string do state para fazer o pedido de posts à API
    handleSearch(string){
        getPosts(string)  
         .then(resposta =>{
            this.setState({
                postsArr : resposta 
            });
        }

        );
    }

    //Devolve o componente apresentado
    render() {
        //Se o URL for o inicial, retorna um componente da classe Posts com dois props (um array de posts e a função handleChange)
        //Se o URL for o ~/id/detalhes devolve o componente Details
        return   <Router>
                    <Route exact path="/" render={(props) => <Posts {...props} posts = {this.state.postsArr} detectChange = {a => this.handleSearch(a)} />} />
                    <Route path="/:id/Detalhes" component={Details} />
                </Router>

    }

}


//Vai a api fazer um Get de Posts
//Faz um pedido à API, se conseguir retorna o Json dos Posts, caso contrario exibe na consola o erro gerado
function getPosts(string){

    let linkPosts = 'http://localhost:5000/api/posts?query='+ string;
    return (
        fetch(linkPosts)
            .then(resposta => {
                if(resposta.ok){
                    return resposta.json();
                }
                return Promise.reject("Erro " + resposta.status + " ao obter os posts");
            })
        );

}




