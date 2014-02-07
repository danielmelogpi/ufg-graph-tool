<html>
<head>
	<title>Documentação - rascunho</title>
	<?
	echo link_tag("assets/css/bootstrap.css"). "\n";
	?>
</head>
<body>
<div class="content" style="padding: 10px">


<p>[RASCUNHO]</p>
<p>&nbsp;</p>
<p dir="ltr">O projeto atualmente &eacute; baseado em um &uacute;nico arquivo HTML, no qual &eacute; manipluado o desenho, feito sobre um &lt;canvas&gt;.</p>
<p><strong>Essa estrutura &eacute; tempor&aacute;ria e servir&aacute; para &nbsp;a montagem da tela de desenho. Haver&aacute; migra&ccedil;&atilde;o para a estrutura de um framework n&atilde;o defindo, mas que provavelmente ser&aacute; o codeigniter.</strong></p>
<p dir="ltr">As pastas, a partir da raiz e com suas descri&ccedil;&otilde;es s&atilde;o:</p>
<ul>
<li dir="ltr">/
<ul>
<li dir="ltr">/css &nbsp; &nbsp; &nbsp;Cont&eacute;m folhas de estilo com a apar&ecirc;ncia da aplica&ccedil;&atilde;o</li>
<li dir="ltr">/js &nbsp; &nbsp; &nbsp;Cont&eacute;m arquivos javascript. Esses arquivos formam o c&eacute;rebro front-end da aplica&ccedil;&atilde;o
<ul>
<li dir="ltr">/multilanguage &nbsp; &nbsp;Arquivos e estrutura da tradu&ccedil;&atilde;o (n&atilde;o implementado)</li>
</ul>
</li>
<li dir="ltr">/docs &nbsp;A documenta&ccedil;&atilde;o</li>
</ul>
</li>
<li dir="ltr">&nbsp;&nbsp;&nbsp;/bootstrap Componentes extras para a interfaces do Twitter Bootstrap</li>
<li dir="ltr">/img &nbsp; &nbsp; Imagens usadas pela aplica&ccedil;&atilde;o, separadas, quando convir, pelo conjunto/set/tema de onde foram baixadas</li>
<li dir="ltr">/fonts &nbsp; Arquivos para tipografia rica.</li>
</ul>
<p dir="ltr">&nbsp;</p>
<h2><span style="text-decoration: underline;">Recursos utilizados</span></h2>
<h2 dir="ltr"><strong>Folhas de estilo</strong></h2>
<p dir="ltr">S&atilde;o utilizadas folhas de estilo do Twitter Bootstrap na vers&atilde;o 3, que possui bastante estiliza&ccedil;&atilde;o pronta para quest&otilde;es de layout e elementos comuns nas p&aacute;ginas.</p>
<p><a href="http://getbootstrap.com/">http://getbootstrap.com/</a><br /><br /></p>
<h2 dir="ltr">Javascript</h2>
<h3>KineticJs</h3>
<p dir="ltr">&Eacute; feito uso extensivo da biblioteca Kinetic Js, atualmente na vers&atilde;o 4.7.2. Essa biblioteca permite uma produtividade maior ao manipular os desenhos, abstraindo, por exemplo procedimentos repetivivos das formas, anima&ccedil;&otilde;es, posicionamento, zoom e redeniza&ccedil;&atilde;o do canvas. O entendimento dessa biblioteca a um n&iacute;vel m&iacute;nimo &eacute; muito importante para uma manuten&ccedil;&atilde;o adequada do aplicativo.</p>
<p dir="ltr"><a href="http://kineticjs.com/">http://kineticjs.com/</a></p>
<h3>JQuery</h3>
<p dir="ltr">O Jquery &eacute; uma biblioteca que permite manipular elementos do html e conjuntos de dados por m&eacute;todos mais simples que os nativos do javascript. .&Eacute; extensamente usado pela comunidade de desenvolvedores font-end e auxilia bastante a intera&ccedil;&atilde;o com o futuro backend.</p>
<p><a href="http://jquery.com/">http://jquery.com/</a></p>
<p>&nbsp;</p>
<h2><span style="text-decoration: underline;">Diagrama de casos de uso</span></h2>
<p>O seguinte diagrama procura esclarecer as diferentes a&ccedil;&otilde;es que podem ser tomadas pelos usu&aacute;rios:</p>
<p><img src="/assets/img/docs/casos-de-uso.jpg" /></p>
<p>&nbsp;</p>
<h2><span style="text-decoration: underline;">Fluxogramas</span></h2>
<p>(incompleto)</p>
<p>Os seguintes fluxogramas buscam esclarecer a l&oacute;gica pela qual opera a tela de desenho, de modo a facilitar &nbsp;a manuten&ccedil;&atilde;o futura.</p>
<h3>Desenho de v&eacute;rtice</h3>
<p><img src="/assets/img/docs/node-draw.jpg" /></p>
<h3>Desenho de aresta</h3>
<p><img src="/assets/img/docs/edge-draw.jpg" /></p>
<h3>Zoom</h3>
<p><p><img src="/assets/img/docs/zoom.jpg" /></p></p>
<h3>Seleção de elementos</h3>
<p><p><img src="/assets/img/docs/selection-elements.png" /></p></p>
<h2>Classes utilizadas do Kinetic.js</h2>
<p><img src="/assets/img/docs/kinetic-classes.jpg" /></p>
<p>&nbsp;</p>
<p>[COMPOR DIAGRAMA DE COMPONENTES GERAIS - QUAL E COMO?]</p>


</div>
</body>
</html>