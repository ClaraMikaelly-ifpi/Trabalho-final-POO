import * as readline from 'readline';
import { RedeSocial } from './redeSocial';
import { Perfil, PerfilAvancado, Publicacao } from './perfil';

export class RedeSocialInterativa {
    private redeSocial: RedeSocial;
    private rl: readline.Interface;

    constructor() {
        this.redeSocial = new RedeSocial();
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    iniciar(): void {
        this.menuPrincipal();
    }

    private menuPrincipal(): void {
        console.log('\n--- Menu Principal ---');
        console.log('1. Gerenciamento de Perfis');
        console.log('2. Gerenciamento de Publicações');
        console.log('3. Gerenciamento de Solicitações');
        console.log('4. Sair');
        this.rl.question('Escolha uma opção: ', (opcao) => {
            switch (opcao) {
                case '1':
                    this.menuPerfis();
                    break;
                case '2':
                    this.menuPublicacoes();
                    break;
                case '3':
                    this.menuSolicitacoes();
                    break;
                case '4':
                    this.rl.close();
                    break;
                default:
                    console.log('Opção inválida. Tente novamente.');
                    this.menuPrincipal();
                    break;
            }
        });
    }

    private menuPerfis(): void {
        console.log('\n--- Gerenciamento de Perfis ---');
        console.log('1. Adicionar Perfil');
        console.log('2. Listar Perfis');
        console.log('3. Ativar/Desativar Perfil');
        console.log('4. Voltar ao Menu Principal');
        this.rl.question('Escolha uma opção: ', (opcao) => {
            switch (opcao) {
                case '1':
                    this.adicionarPerfil();
                    break;
                case '2':
                    this.listarPerfis();
                    break;
                case '3':
                    this.ativarDesativarPerfil();
                    break;
                case '4':
                    this.menuPrincipal();
                    break;
                default:
                    console.log('Opção inválida. Tente novamente.');
                    this.menuPerfis();
                    break;
            }
        });
    }

    // Métodos do menuPerfis
    private adicionarPerfil(): void {
        this.rl.question('ID: ', (id) => {
            this.rl.question('Apelido: ', (apelido) => {
                this.rl.question('Foto (emoji): ', (foto) => {
                    this.rl.question('Email: ', (email) => {
                        const perfil = new Perfil(id, apelido, foto, email);
                        this.redeSocial.adicionarPerfil(perfil);
                        console.log('Perfil adicionado com sucesso!');
                        this.menuPerfis();
                    });
                });
            });
        });
    }

    private listarPerfis(): void {
        const perfis = this.redeSocial.listarPerfis();
        console.log('\nPerfis cadastrados:');
        perfis.forEach(perfil => console.log(`- ${perfil['apelido']} (${perfil['email']})`));
        this.menuPerfis();
    }

    private ativarDesativarPerfil(): void {
        this.rl.question('Email do perfil: ', (emailAvancado) => {
            const perfilAvancado = this.redeSocial.buscarPerfil(undefined, undefined, emailAvancado) as PerfilAvancado;
            if (perfilAvancado) {
                this.rl.question('Email do perfil a ser ativado/desativado: ', (email) => {
                    const perfil = this.redeSocial.buscarPerfil(undefined, undefined, email);
                    if (perfil) {
                        this.redeSocial.ativarDesativarPerfil(perfilAvancado, perfil);
                        console.log('Perfil ativado/desativado com sucesso!');
                    } else {
                        console.log('Perfil não encontrado.');
                    }
                    this.menuPerfis();
                });
            } else {
                console.log('Perfil não encontrado ou não autorizado.');
                this.menuPerfis();
            }
        });
    }

    // Métodos do menuPublicacoes
    private menuPublicacoes(): void {
        console.log('\n--- Gerenciamento de Publicações ---');
        console.log('1. Adicionar Publicação');
        console.log('2. Listar Publicações');
        console.log('3. Voltar ao Menu Principal');
        this.rl.question('Escolha uma opção: ', (opcao) => {
            switch (opcao) {
                case '1':
                    this.adicionarPublicacao();
                    break;
                case '2':
                    this.listarPublicacoes();
                    break;
                case '3':
                    this.menuPrincipal();
                    break;
                default:
                    console.log('Opção inválida. Tente novamente.');
                    this.menuPublicacoes();
                    break;
            }
        });
    }

    private adicionarPublicacao(): void {
        this.rl.question('Apelido do perfil: ', (apelido) => {
            const perfil = this.redeSocial.buscarPerfil(undefined, undefined, apelido);
            if (perfil) {
                this.rl.question('Conteúdo: ', (conteudo) => {
                    const publicacao = new Publicacao(Date.now().toString(), conteudo, perfil);
                    this.redeSocial.adicionarPublicacao(publicacao);
                    console.log('Publicação adicionada com sucesso!');
                    this.menuPublicacoes();
                });
            } else {
                console.log('Perfil não encontrado.');
                this.menuPublicacoes();
            }
        });
    }

    private listarPublicacoes(): void {
        const publicacoes = this.redeSocial.listarPublicacoes();
        console.log('\nPublicações:');
        publicacoes.forEach(pub => console.log(`- [${pub['dataHora']}] ${pub['conteudo']}`));
        this.menuPublicacoes();
    }

    // Métodos do menuSolicitacoes
    private menuSolicitacoes(): void {
        console.log('\n--- Gerenciamento de Solicitações ---');
        console.log('1. Enviar Solicitação de Amizade');
        console.log('2. Aceitar Solicitação');
        console.log('3. Recusar Solicitação');
        console.log('4. Voltar ao Menu Principal');
        this.rl.question('Escolha uma opção: ', (opcao) => {
            switch (opcao) {
                case '1':
                    this.enviarSolicitacaoAmizade();
                    break;
                case '2':
                    this.aceitarSolicitacao();
                    break;
                case '3':
                    this.recusarSolicitacao();
                    break;
                case '4':
                    this.menuPrincipal();
                    break;
                default:
                    console.log('Opção inválida. Tente novamente.');
                    this.menuSolicitacoes();
                    break;
            }
        });
    }

    private enviarSolicitacaoAmizade(): void {
        this.rl.question('Email do perfil remetente: ', (Email) => {
            const perfilRemetente = this.redeSocial.buscarPerfil(undefined, undefined, Email);
            if (perfilRemetente) {
                this.rl.question('Email do perfil destinatário: ', (Email) => {
                    const perfilDestinatario = this.redeSocial.buscarPerfil(undefined, undefined, Email);
                    if (perfilDestinatario) {
                        this.redeSocial.enviarSolicitacaoAmizade(perfilRemetente, perfilDestinatario);
                        console.log('Solicitação de amizade enviada com sucesso!');
                    } else {
                        console.log('Perfil destinatário não encontrado.');
                    }
                    this.menuSolicitacoes();
                });
            } else {
                console.log('Perfil remetente não encontrado.');
                this.menuSolicitacoes();
            }
        });
    }

    private aceitarSolicitacao(): void {
        this.rl.question('Email do perfil destinatário: ', (Email) => {
            const perfilDestinatario = this.redeSocial.buscarPerfil(undefined, undefined, Email);
            if (perfilDestinatario) {
                this.redeSocial.aceitarSolicitacao(perfilDestinatario);
                console.log('Solicitação de amizade aceita com sucesso!');
            } else {
                console.log('Perfil destinatário não encontrado.');
            }
            this.menuSolicitacoes();
        });
    }

    private recusarSolicitacao(): void {
        this.rl.question('Email do perfil destinatário: ', (Email) => {
            const perfilDestinatario = this.redeSocial.buscarPerfil(undefined, undefined, Email);
            if (perfilDestinatario) {
                this.redeSocial.recusarSolicitacao(perfilDestinatario);
                console.log('Solicitação de amizade recusada com sucesso!');
            } else {
                console.log('Perfil destinatário não encontrado.');
            }
            this.menuSolicitacoes();
        });
    }
}

