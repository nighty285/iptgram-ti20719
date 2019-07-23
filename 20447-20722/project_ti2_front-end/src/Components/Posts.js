import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

export class Posts extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
      };
    }

    render(){
        //faz o mapeamento do array de imagens num array de div's que será apresentado coomo resultado da pesquisa do input no return do render
        let aux = this.props.posts.map((p , i) => 
             {
            return ( 
            <div>
                <div className="card">   
                    <Link to={`/${p.id}/Detalhes`}> <img class = "imgJPG" src={`http://localhost:5000/api/posts/${p.id}/image`} /></Link>
                    <div className="card-body">
                    <p className="prg1" >Nome do Utilizador: {p.user.name}</p>
                    <p className="prg1">Data de publicação: {new Intl.DateTimeFormat('pt-PT').format(new Date(p.postedAt))}</p>
                    <p className="prg1">❤️ {p.likes} Likes</p>
                    <p className="prg1">💬 {p.comments} Comentários</p>
                    </div>
                </div>
            </div>
                    )
        }); 

        //caixa de pesquisa e resultado da pesquisa criado atrás
        return (<div> <input className ="pesquisa"  placeholder="Pesquisar Posts.." type = "text" onChange = {(evt) =>this.props.detectChange(evt.target.value)} />
                    <br/> 
                    {aux}
               </div>);
    }

}