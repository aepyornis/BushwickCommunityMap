<?php
/**
 * The header for our theme.
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package bcm
 */

?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="profile" href="http://gmpg.org/xfn/11">
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
    
<?php wp_head(); ?>
    
</head>
<body <?php body_class(); ?>>
  
<div id="intro_and_slides">
    <!-- Map title and intro -->
    <div id="intro">
    <a id="language" href="#">en Español</a><br>
    <h1 class="en"><a href="../index.html" class="button">North West Bushwick Community Map</a></h1>
    <h1 class="es"><a href="../index.html" class="button">Mapa Comunitario de North West Bushwick</a></h1>
    </div>
    <div class="wp-sidebar">
<?php get_sidebar(); ?>
    </div>
</div>

    <!-- top menu bar ENGLISH-->
    <div class="navigation en">
    <ul class="navbar">        
<li><a href="./about.html" class="button">About</a></li>
        <li><a href="/html/get_help.html" class="button">Get Help</a></li>
        <li><a href="/html/get_involved.html" class="button">Get Involved</a></li>
        <li><a href="/html/research.html" class="button">Research</a></li>
        <li><a href="/html/contact.html" class="button">Contact</a></li>
        <li><a href="/blog" class="button">Blog</a></li>
    </ul>
    </div>

<div id="content" class="site-content">
