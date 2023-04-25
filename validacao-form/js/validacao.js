
export function valida(input) {
   const tipoDeInput = input.dataset.tipo

   if (validadores[tipoDeInput]) {
      validadores[tipoDeInput](input)
   }

   if (input.validity.valid) {
      input.parentElement.classList.remove('input-container--invalido')
      input.parentElement.querySelector('.input-mensagem-erro').innerHTML = ''
   } else {
      input.parentElement.classList.add('input-container--invalido')
      input.parentElement.querySelector('.input-mensagem-erro').innerHTML = mostraMensagemDeErro(tipoDeInput, input)
   }

}

const tiposDeErro = [
   'valueMissing',
   'typeMismatch',
   'patternMismatch',
   'customError'
]

const mensagensDeErro = {
   nome: {
      valueMissing: 'O campo nome não pode estar vazio.'
   },
   email: {
      valueMissing: 'O campo de email não pode estar vazio.',
      typeMismatch: 'O email digitado não é válido.'
   },
   senha: {
      valueMissing: 'O campo de senha não pode estar vazio',
      patternMismatch: 'A senha deve conter entre 6 a 12 caracteres, deve conter pelo menos uma letra maiuscula, um número e não deve conter símbolos'
   },
   dataNascimento: {
      valueMissing: 'O campo de data de nascimento não pode estar vazio',
      customError: 'Você deve ser maior que 18 anos para se cadastrar'
   },
   cpf: {
      valueMissing: 'O campo CPF não pode estar vazio.',
      customError: 'O CPF digitado não é válido.'
   }
}

const validadores = {
   dataNascimento: input => validaDataNascimento(input),
   cpf: input => validaCPF(input)
}

// const dataNascimento = document.querySelector('#nascimento')

// dataNascimento.addEventListener('blur', (evento) => {
//    validaDataNascimento(evento.target)
// })

function mostraMensagemDeErro(tipoDeInput, input) {
   let mensagem = ''
   tiposDeErro.forEach(erro => {
      if (input.validity[erro]) {
         mensagem = mensagensDeErro[tipoDeInput][erro]
      }
   })

   return mensagem
}

function validaDataNascimento(input) {
   const dataRecebida = new Date(input.value)
   let mensagem = '';

   if (!maiorQue18(dataRecebida)) {
      mensagem = 'Você deve ser maior que 18 anos para se cadastrar'
   }

   input.setCustomValidity(mensagem)
}

function maiorQue18(data) {
   const dataAtual = new Date()
   const dataMais18 = new Date(data.getUTCFullYear() + 18, data.getUTCMonth(), data.getUTCDate())

   return dataMais18 <= dataAtual
}

function validaCPF(input) {
   const cpfFormatado = input.value.replace(/\D/g, '')
   let mensagem = ''

   if (!chacaCPFRepetido(cpfFormatado) || !checaEstruturaCPF(cpfFormatado)) {
      mensagem = 'O cpf digitado não é válido.'
   }

   input.setCustomValidity(mensagem)
}

function chacaCPFRepetido(cpf) {
   const valoresRepetidos = [
      '00000000000',
      '11111111111',
      '22222222222',
      '33333333333',
      '44444444444',
      '55555555555',
      '66666666666',
      '77777777777',
      '88888888888',
      '99999999999'
   ]

   let cpfValido = true

   valoresRepetidos.forEach(valor => {
      if (valor == cpf) {
         cpfValido = false
      }
   })

   return cpfValido
}

function checaEstruturaCPF(cpf) {
   const multiplicador = 10

   return checaDigitoVerificador(cpf, multiplicador)
}

function checaDigitoVerificador(cpf, multiplicador) {
   if (multiplicador >= 12) {
      return true
   }

   let multiplicadorInicial = multiplicador
   let soma = 0
   const cpfSemDigitos = cpf.substr(0, multiplicador - 1).split('')
   const digitoVerificador = cpf.charAt(multiplicador - 1)
   for (let contador = 0; multiplicadorInicial > 1; multiplicadorInicial--) {
      soma = soma + cpfSemDigitos[contador] * multiplicadorInicial
      contador++
   }

   if (digitoVerificador == confirmaDigito(soma)) {
      return checaDigitoVerificador(cpf, multiplicador + 1)
   }

   return false
}

function confirmaDigito(soma) {
   return 11 - (soma % 11)
}

// let soma = (10*1) + (9*2) + (8*3)

// let difitoVerificador = 11 - (soma/11)