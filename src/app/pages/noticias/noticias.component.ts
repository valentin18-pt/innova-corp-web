import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-noticias',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './noticias.component.html',
    styleUrls: ['./noticias.component.css']
})
export class NoticiasComponent implements OnInit {
    private route = inject(ActivatedRoute);

    noticias = [
        {
            id: 1,
            img: 'images/noticias/virgen_sapallanga.webp',
            titulo: 'Impresionante mirador de “Mamacha Cocharcas” en Sapallanga',
            fecha: '4 de enero del 2026',
            contenido: `La tierra del Akshu Tatay y el chicharrón colorado, el distrito de Sapallanga en la provincia de Huancayo, inauguró un imponente mirador de 28 metros de altura (aproximadamente nueve pisos) en honor a su patrona: la “Mamacha Cocharcas”.

Con este nuevo atractivo turístico, el distrito estima que recibirá a aproximadamente 350 mil visitantes por año.

La inauguración se realizó en el marco del 169.° Aniversario de Creación Política del distrito de Sapallanga. Lo que más destaca del mirador es la representación de la Virgen de Cocharcas, creada durante varios meses en el distrito de Mito por el escultor Carlos Verástegui Perales.

Esta obra es hasta tres veces más grande que la Virgen de Piedra Parada de Concepción y promete ser uno de los atractivos más importantes al sur de Huancayo.

TURISMO. El espacio incluye también una pasarela de vidrio desde donde los visitantes podrán tomarse impresionantes fotografías. El complejo cuenta también con cuatro campos deportivos de césped sintético y un espacio recreacional completo al aire libre.

La gastronomía y la artesanía no se quedan atrás: en los puestos de comida se podrán degustar platos típicos de la zona como el chicharrón colorado, chicharrón dorado, cuy colorado, cuy chactado y el alwish lulo, entre otros.`,
            fuente: 'Correo',
            fuenteLink: 'https://diariocorreo.pe/edicion/huancayo/sapallanga-estrena-mirador-turistico-con-imagen-monumental-de-la-virgen-de-cocharcas-noticia/'
        },
        {
            id: 2,
            img: 'images/noticias/danzas_sapallanga.webp',
            titulo: 'Coloridos bailes tradicionales llenan de identidad y cultura a Sapallanga',
            fecha: '4 de enero del 2026',
            contenido: `En los puestos de artesanía se ofrecen los tradicionales bordados huancas, capas de la Negrería de Sapallanga y estatuillas de la chonguinada, colla y carachaquis. La identidad cultural del distrito se manifiesta en cada danza, donde los pobladores rinden homenaje a sus ancestros con trajes llenos de color y simbolismo.

Esta celebración no solo atrae a locales, sino a turistas de todo el mundo que buscan experimentar la autenticidad de las tradiciones andinas. Los maestros artesanos han trabajado arduamente para mantener vivas las técnicas ancestrales, asegurando que las futuras generaciones sigan portando con orgullo estos trajes de gala.

El festival de danzas se ha consolidado como uno de los eventos más importantes del valle, promoviendo el respeto por la cultura y el fortalecimiento de la comunidad.`,
            fuente: 'Correo',
            fuenteLink: 'https://diariocorreo.pe/edicion/huancayo/huancayo-impresionante-mirador-de-mamacha-cocharcas-en-sapallanga-fotos-noticia/'
        },
        {
            id: 3,
            img: 'images/noticias/comidas_sapallanga.webp',
            titulo: 'Deliciosa gastronomía típica que conquista Sapallanga',
            fecha: '5 de enero del 2026',
            contenido: `La gastronomía y la artesanía no se quedan atrás: en los puestos de comida se podrán degustar platos típicos de la zona como el chicharrón colorado, chicharrón dorado, cuy colorado, cuy chactado y el alwish lulo, entre otros. Los sabores intensos y el uso de ingredientes locales de primera calidad son el sello distintivo de los cocineros de Sapallanga.

Además de los platos principales, los visitantes pueden disfrutar de postres tradicionales y bebidas artesanales producidas en la región. Cada bocado cuenta una historia de esfuerzo y dedicación por parte de los productores locales, quienes ven en la comida una oportunidad para compartir su riqueza gastronómica con el mundo.

Este auge culinario ha permitido que muchos emprendedores del distrito abran sus propios locales, dinamizando la economía local y convirtiendo a Sapallanga en un destino imperdible para los amantes de la buena mesa.`,
            fuente: 'Correo',
            fuenteLink: 'https://diariocorreo.pe/edicion/huancayo/huancayo-impresionante-mirador-de-mamacha-cocharcas-en-sapallanga-fotos-noticia/'
        },
        {
            id: 4,
            img: 'images/noticias/ulla_coto.webp',
            titulo: 'Sitio Arqueológico De Ulla Coto De Sapallanga',
            fecha: '15 de enero del 2026',
            contenido: `El Sitio Arqueológico de Ullacoto ubicado en el barrio Virgen de Cocharcas del Centro Poblado de Cocharcas, al NO del distrito de Sapallanga, fueron colcas que datan del intermedio tardío (1000 – 1460 d.c.), perteneció a la Cultura Wanca; se hallan a media ladera del cerro Ullacoto, cuyas edificaciones van siguiendo la línea de curvatura de dicho cerro, al parecer existieron un promedio de 100 colcas entorno a la colina dando la apariencia de media luna; infortunadamente hoy en día solo quedan 34 de los cuales la mitad están en regular estado de conservación gracias a los pobladores vecinos, quienes han logrado conservarlas, del resto de construcciones solo quedan los cimientos.

Las características arquitectónicas de su construcción muestran que están edificadas en columna de a uno y presentan las siguientes características: Planta, cada unidad tiene una planta en forma cuadrilátero irregular, su medida promedio es de 6 x 5 m, la distancia que separa de una a otra oscila entre 1.80 a 2 m., Piso: se ha demostrado que todos llevan en el piso un cuidadoso empedrado, con la finalidad de aislar la unidad de infiltración subterránea que son factores negativos en todo sistema de almacenaje; presentan además tres niveles: nivel A (constituido por tierra compactada muy bien apisonada que sirve como base primitiva del empedrado), nivel B (es una delgada capa de graba que sirve de cobija al nivel c), nivel C (son las lajas que forman el piso de la unidad, dichas lajas están unidas entre sí por tierra muy bien batida cuya consistencia es ligeramente inferior al cemento armado.`,
            fuente: 'Mincetur',
            fuenteLink: 'https://consultasenlinea.mincetur.gob.pe/fichaInventario/index.aspx?cod_Ficha=6891'
        },
        {
            id: 5,
            img: 'images/noticias/mirador_sancristobal.webp',
            titulo: 'Mirador Cerro San Cristóbal De Sapallanga',
            fecha: '20 de enero del 2026',
            contenido: `El Mirador Cerro San Cristóbal se halla en la parte oriental del distrito de Sapallanga, en una extensión superficial de 7549,837 m2 sobre la colina del mismo nombre, con una altitud de 260 metros teniendo como referencia el Parque 28 de Julio. Este espacio nos permite visualizar un singular panorama, por el norte parte de la provincia de Huancayo, el distrito de Chilca por el sur el distrito de Pucara, por el oeste los distritos de Huamancaca Chico y Tres de Diciembre, por el lado este se puede visualizar el paraje Canlas, Cuncayo y el barrio La Unión.

Así mismo en la cima del cerro se aprecia un terraplén donde se ha construido una capilla de material rustico de 3 m de ancho por 5 m de largo, de arquitectura andina con techo de tejas de arcilla, a dos aguas, una puerta con rejas metálicas; los devotos mencionan que fue construida por el año 1960, destinada para la concentración de los fieles devotos cuando se celebran actividades litúrgicas en Semana Santa.

Al costado derecho de la capilla se encuentra una cruz de cemento, de color blanco, con una altura de 4 m, también podemos apreciar arcos revestidos con piedra laja y cemento; continuando al lado derecho, se ubica una pérgola de 6 m por 6 m con muros de piedra laja y cemento de 40 cm de ancho, con barandas, columnas y vigas de madera, techos de teja, un espacio que permite protegerse del clima.`,
            fuente: 'Mincetur',
            fuenteLink: 'https://consultasenlinea.mincetur.gob.pe/fichaInventario/index.aspx?cod_Ficha=5645'
        }
    ];

    selectedNoticiaId = signal<number>(1);

    noticiaPrincipal = computed(() => {
        const id = this.selectedNoticiaId();
        return this.noticias.find(n => n.id === id) || this.noticias[0];
    });

    otrasNoticias = computed(() => {
        const id = this.selectedNoticiaId();
        return this.noticias.filter(n => n.id !== id);
    });

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            const id = params['id'];
            if (id) {
                this.selectedNoticiaId.set(parseInt(id));
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    seleccionarNoticia(id: number) {
        this.selectedNoticiaId.set(id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
