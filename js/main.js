const servicios = [
	{
		id: 'web',
		nombre: 'Desarrollo Web',
		descripcion:
			'Sitios responsivos y funcionales para todo tipo de negocio.',
		precio: 1000000,
	},
	{
		id: 'uxui',
		nombre: 'Diseño UX/UI',
		descripcion: 'Interfaces centradas en la experiencia del usuario.',
		precio: 600000,
	},
	{
		id: 'seo',
		nombre: 'Estrategia SEO',
		descripcion: 'Optimización para motores de búsqueda y visibilidad online.',
		precio: 1750000,
	},
];

const opcionesPorServicio = {
	web: [
		{ label: 'Idioma adicional', precio: 600000, type: 'checkbox' },
		{
			label: 'Optimización Reponsive',
			precio: 500000,
			type: 'checkbox',
		},
		{
			label: 'Cantidad de páginas internas',
			type: 'number',
			precioPorUnidad: 80000,
			placeholder: 'Ingrese cantidad',
		},
		{
			label: 'Mantenimiento Web',
			type: 'select',
			options: {
				'No incluido': 0,
				Mensual: 350000,
				Anual: 3600000,
			},
		},
	],
	uxui: [
		{ label: 'Prototipo interactivo', precio: 500000, type: 'checkbox' },
		{ label: 'Diseño accesible', precio: 200000, type: 'checkbox' },
	],
	seo: [
		{ label: 'Creación de textos SEO', precio: 500000, type: 'checkbox' },
		{ label: 'Consultoría SEO Avanzada', precio: 800000, type: 'checkbox' },
	],
};

const contenedorServicios = document.querySelector('#contenedor-servicios');
const contenedorOpciones = document.querySelector('#contenedor-opciones');
const totalSpan = document.querySelector('#total-estimado');
let seleccionados = [];

servicios.forEach((servicio) => {
	const tarjeta = document.createElement('div');
	tarjeta.className = 'card-servicio';
	tarjeta.innerHTML = `
    <div>
      <h3>${servicio.nombre}</h3>
      <p>${servicio.descripcion}</p>
      <p>Desde $${servicio.precio.toLocaleString('es-CO')}</p>
    </div>
  `;

	tarjeta.addEventListener('click', () => {
		const index = seleccionados.indexOf(servicio.id);
		if (index > -1) {
			seleccionados.splice(index, 1);
			tarjeta.classList.remove('activo');
		} else {
			seleccionados.push(servicio.id);
			tarjeta.classList.add('activo');
		}
		renderizarOpciones();
		actualizarTotal();
	});
	contenedorServicios.appendChild(tarjeta);
});

function renderizarOpciones() {
	contenedorOpciones.innerHTML = '';
	seleccionados.forEach((id) => {
		const servicio = servicios.find((s) => s.id === id);
		const extras = opcionesPorServicio[id] || [];
		if (!servicio) return;
		const bloque = document.createElement('div');
		bloque.className = 'opciones-servicio';
		const encabezado = document.createElement('h4');
		encabezado.textContent = servicio.nombre;
		bloque.appendChild(encabezado);
		extras.forEach((extra) => {
			if (extra.type === 'select') {
				const etiqueta = document.createElement('label');
				etiqueta.className = 'etiqueta-select';
				const select = document.createElement('select');
				Object.entries(extra.options).forEach(([key, precio]) => {
					const option = document.createElement('option');
					option.value = precio;
					option.textContent = `${key} ($${precio.toLocaleString(
						'es-CO'
					)})`;
					select.appendChild(option);
				});
				select.setAttribute('data-precio-select', 'true');
				select.addEventListener('change', actualizarTotal);
				etiqueta.textContent = extra.label;
				etiqueta.appendChild(select);
				bloque.appendChild(etiqueta);
			} else if (extra.type === 'number') {
				const etiqueta = document.createElement('label');
				etiqueta.textContent = extra.label;
				etiqueta.className = 'etiqueta-number';
				const input = document.createElement('input');
				input.type = 'number';
				input.min = 0;
				input.placeholder = extra.placeholder || '';
				input.setAttribute(
					'data-precio-unitario',
					extra.precioPorUnidad
				);
				input.addEventListener('input', actualizarTotal);
				etiqueta.appendChild(input);
				bloque.appendChild(etiqueta);
			} else {
				const etiqueta = document.createElement('label');
				etiqueta.innerHTML = `<input type="checkbox" data-precio="${
					extra.precio
				}"> ${extra.label} ($${extra.precio.toLocaleString('es-CO')})`;
				etiqueta
					.querySelector('input')
					.addEventListener('change', actualizarTotal);
				bloque.appendChild(etiqueta);
			}
		});
		contenedorOpciones.appendChild(bloque);
	});
}

function actualizarTotal() {
	let total = seleccionados.reduce((acc, id) => {
		const servicio = servicios.find((s) => s.id === id);
		return acc + (servicio ? servicio.precio : 0);
	}, 0);

	const checkboxes = document.querySelectorAll(
		'#contenedor-opciones input[type="checkbox"]:checked'
	);
	checkboxes.forEach((input) => {
		const extraPrecio = parseInt(input.getAttribute('data-precio'));
		if (!isNaN(extraPrecio)) total += extraPrecio;
	});

	const selects = document.querySelectorAll(
		'#contenedor-opciones select[data-precio-select]'
	);
	selects.forEach((select) => {
		const valor = parseInt(select.value);
		if (!isNaN(valor)) total += valor;
	});

	const numeros = document.querySelectorAll(
		'#contenedor-opciones input[type="number"]'
	);
	numeros.forEach((input) => {
		const cantidad = parseInt(input.value);
		const precioUnitario = parseInt(
			input.getAttribute('data-precio-unitario')
		);
		if (!isNaN(cantidad) && !isNaN(precioUnitario)) {
			total += cantidad * precioUnitario;
		}
	});

	if (totalSpan) {
		totalSpan.textContent = `$${total.toLocaleString('es-CO')}`;
	}
}

function enviarFormulario() {
    const form = document.querySelector('#formulario-cotizacion');
	const nombre = document.querySelector('#nombre').value.trim();
	const email = document.querySelector('#email').value.trim();
	const proyecto = document.querySelector('#proyecto').value.trim();

	if (!nombre || !email || !proyecto) {
		Swal.fire({
			icon: 'warning',
			title: 'Campos incompletos',
			text: 'Por favor completa tu nombre, email y proyecto.',
			background: '#1a1a1a',
			color: '#fff',
			confirmButtonColor: '#005CFF',
		});
		return;
	}

	Swal.fire({
		icon: 'success',
		title: '¡Cotización enviada!',
		text: 'Gracias por confiar. Pronto me pondré en contacto contigo.',
		background: '#1a1a1a',
		color: '#fff',
		confirmButtonColor: '#005CFF',
	}).then(() => {
		form.reset();
	});
}
