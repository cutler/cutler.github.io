{% extends '_layout.swig' %}
{% import '_macro/post.swig' as post_template %}
{% import '_macro/sidebar.swig' as sidebar_template %}

{% block title %} {{ config.title }} {% endblock %}

{% block page_class %}
  {% if is_home() %} page-home {% endif %}
{% endblock %}

{% block content %}
<div id="main"  class="full-image">
	<div style="position:relative">
	    <img src="/img/main_title.png" style="position:absolute;left:-95px;top:-85px">  
	</div>
	<img src="/img/main_bg.jpg"> 
</div>
{% endblock %}

{% block sidebar %}
  {{ sidebar_template.render(false) }}
{% endblock %}
