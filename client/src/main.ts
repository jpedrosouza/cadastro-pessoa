import "./main.scss";
import "./webcomponents/input/component";
import "./webcomponents/form/component";
import { HTMLXForm } from "./webcomponents/form/component";

const elMain = <HTMLElement>document.querySelector('main');
const elBtNewForm = <HTMLButtonElement>document.querySelector('.new-form');

elBtNewForm.addEventListener('click', el => {
    const form = <HTMLXForm>document.createElement("x-form");
    elMain.insertBefore(form, elBtNewForm.nextElementSibling);
});

async function listarPessoas() {
    const req = await fetch("http://localhost:8081/pessoa/");
    const res = await req.json();
    res.forEach((pessoa: { nome: string, sobrenome: string, apelido: string }) => {
        const el = <HTMLXForm>document.createElement("x-form");
        el.load(pessoa);
        elMain.appendChild(el);
    });
}

listarPessoas();