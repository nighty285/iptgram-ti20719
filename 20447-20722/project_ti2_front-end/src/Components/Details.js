import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

export class Details extends React.Component {
    constructor(props) {
      super(props);
        
      //state com um objecto detalhes, duas variaveis de controlo e um array de comments
      this.state = {
          detalhes : {},
          isLoading : true,
          isLoading2 : true,
          comments : []

      };
    }

    //Método executado logo após o componente ter sido montado
    //Chama a função que usa a o ID do Post para obter o respectivo post da API e em seguida os comentários desse Post
    componentDidMount(){
        getUniquePost(this.props.match.params.id)
            .then(resposta =>{
                this.setState({
                     detalhes : resposta,
                     isLoading : false
                });
            }
        );
        getComments(this.props.match.params.id)
            .then(resposta =>{
                console.log(resposta);
                this.setState({
                    comments : resposta, 
                    isLoading2 : false
                }); 
        });
    }

    //
render(){
    //Se ainda não recebeu o Array dos comments e os detalhes do Post aguarda
    if(this.state.isLoading && this.state.isLoading2){
        return (<div>A aguardar pelos dados...</div>);
    }else{
            //Variável que contrói os comentários de um Post, fazendo o mapeamento do array de comentários para div's
    var aux =this.state.comments.map((p , i) =>
    <div className="card-body">
        <div class="nome2"> Nome do Utilizador: {p.user.name} </div>
        <div class="data2"> Data de publicação: {new Intl.DateTimeFormat('pt-PT').format(new Date(p.postedAt))} </div>
        <div class="comentarios"> 💬 Comentário: {p.text} </div>
        <br />
    </div>
    );
        //Constrói e retorna o objecto HTML
        return <div>
                    <Link to={`/`}>
                    <button class= "btn1">⬅️ Voltar à Lista de Posts</button>
                    </Link>
                <div className="card">
                    <img class = "imgJPG1" src={`http://localhost:5000/api/posts/${this.props.match.params.id}/image`}  />
                    <div className="card-body">
                    <p class="nome1">Nome do Utilizador: {this.state.detalhes.user.name}</p>
                    <p class="data1"> 🗓️ Data de publicação: {new Intl.DateTimeFormat('pt-PT').format(new Date(this.state.detalhes.postedAt))}</p>
                    <p class="caption"> 🖉 Legenda: {this.state.detalhes.caption}</p>
                    <p class="like"> ❤️ {this.state.detalhes.likes} Likes</p>
                    </div>
                    {aux}
                </div>
            </div>     
        }
    }
}  
    
// Pedido à API para ir buscar os detalhes de um Post
function getUniquePost(id){
    let linkPosts = 'https://ipt-ti2-iptgram.azurewebsites.net/api/posts/' + id;
    return (
        fetch(linkPosts)
            .then(resposta => {
                if(resposta.ok){
                    return resposta.json();                   
                }
                return Promise.reject("Erro " + resposta.status + " ao obter os detalhes do post");
            })
        );
}

// Pedido à API para ir buscar os comentários de um Post
function getComments(id){
    let linkComments = 'https://ipt-ti2-iptgram.azurewebsites.net/api/posts/' + id + '/comments';
    console.log(linkComments);
    return (
        fetch(linkComments)
            .then(resposta => {
                if(resposta.ok){
                    return resposta.json();
                }
                return Promise.reject("Erro " + resposta.status + " ao obter os comentários do post");
            })
        );
        

}





