{% macro render(post, is_index, post_extra_class) %}

  {% set headlessPost = Array.prototype.indexOf.call(['quote', 'picture'], post.type) > -1 %}
  {% set navlessPost = headlessPost %}

  {% set post_class = 'post post-type-' + post.type | default('normal') %}
  {% set post_class = post_class + ' ' + post_extra_class | default('') %}
  {% if post.sticky > 0 %}
    {% set post_class = post_class + ' ' + 'post-sticky' %}
  {% endif %}

  <article class="{{ post_class }}" itemscope itemtype="http://schema.org/Article">

    {% if not headlessPost %}
      <header class="post-header">

        {# Not to show title for quote posts that do not have a title #}
        {% if not (is_index and post.type === 'quote' and not post.title) %}
          <h1 class="post-title" itemprop="name headline">
            {# Link posts #}
            {% if post.link %}
              {% if post.sticky > 0 %}
                {{ post.sticky }}
                <span class="post-sticky-flag" title="{{ __('post.sticky') }}">
                  <i class="fa fa-thumb-tack"></i>
                </span>
              {% endif %}
              <a class="post-title-link post-title-link-external" target="_blank" href="{{ url_for(post.link) }}" itemprop="url">
                {{ post.title or post.link }}
                <i class="fa fa-external-link"></i>
              </a>
            {% else %}
              {% if is_index %}
                {% if post.sticky > 0 %}
                  <span class="post-sticky-flag" title="{{ __('post.sticky') }}">
                    <i class="fa fa-thumb-tack"></i>
                  </span>
                {% endif %}
                <a class="post-title-link" href="{{ url_for(post.path) }}" itemprop="url">
                  {{ post.title | default(__('post.untitled'))}}
                </a>
              {% else %}
                {{ post.title }}
              {% endif %}
            {% endif %}
          </h1>
        {% endif %}

        <div class="post-meta">
          <span class="post-time">
            <span class="post-meta-item-icon">
              <i class="fa fa-calendar-o"></i>
            </span>
            <span class="post-meta-item-text">{{ __('post.posted') }}</span>
            <time itemprop="dateCreated" datetime="{{ moment(post.date).format() }}" content="{{ date(post.date, config.date_format) }}">
              {{ date(post.date, config.date_format) }}
            </time>
          </span>

          {% if post.categories and post.categories.length %}
            <span class="post-category" >
              &nbsp; | &nbsp;
              <span class="post-meta-item-icon">
                <i class="fa fa-folder-o"></i>
              </span>
              <span class="post-meta-item-text">{{ __('post.in') }}</span>
              {% for cat in post.categories %}
                <span itemprop="about" itemscope itemtype="https://schema.org/Thing">
                    <span itemprop="name">{{ cat.name }}</span>
                </span>

                {% set cat_length = post.categories.length %}
                {% if cat_length > 1 and loop.index !== cat_length %}
                  {{ __('symbol.comma') }}
                {% endif %}

              {% endfor %}
            </span>
          {% endif %}

          {% if not is_index and theme.facebook_sdk.enable and theme.facebook_sdk.like_button %}
            &nbsp; | &nbsp;
            <div class="fb-like" data-layout="button_count" data-share="true"></div>
          {% endif %}

          {# LeanCould PageView #}
          {% if theme.leancloud_visitors.enable %}
             <span id="{{ url_for(post.path) }}" class="leancloud_visitors" data-flag-title="{{ post.title }}">
               &nbsp; | &nbsp;
               <span class="post-meta-item-icon">
                 <i class="fa fa-eye"></i>
               </span>
               <span class="post-meta-item-text">{{__('post.visitors')}} </span>
               <span class="leancloud-visitors-count"></span>
              </span>
          {% endif %}

          {% if not is_index and theme.busuanzi_count.enable and theme.busuanzi_count.page_pv %}
              &nbsp; | &nbsp;
              <span class="page-pv">{{ theme.busuanzi_count.page_pv_header }}
              <span class="busuanzi-value" id="busuanzi_value_page_pv" ></span>{{ theme.busuanzi_count.page_pv_footer }}
              </span>
          {% endif %}
        </div>
      </header>
    {% endif %}


    <div class="post-body" itemprop="articleBody">

      {# Gallery support #}
      {% if post.photos and post.photos.length %}
        <div class="post-gallery" itemscope itemtype="http://schema.org/ImageGallery">
          {% set COLUMN_NUMBER = 3 %}
          {% for photo in post.photos %}
            {% if loop.index0 % COLUMN_NUMBER === 0 %}<div class="post-gallery-row">{% endif %}
              <a class="post-gallery-img fancybox"
                 href="{{ url_for(photo) }}" rel="gallery_{{ post._id }}"
                 itemscope itemtype="http://schema.org/ImageObject" itemprop="url">
                <img src="{{ url_for(photo) }}" itemprop="contentUrl"/>
              </a>
            {% if loop.index0 % COLUMN_NUMBER === 2 %}</div>{% endif %}
          {% endfor %}

          {# Append end tag for `post-gallery-row` when (photos size mod COLUMN_NUMBER) is less than COLUMN_NUMBER #}
          {% if post.photos.length % COLUMN_NUMBER > 0 %}</div>{% endif %}
        </div>
      {% endif %}

      {% if is_index %}
        {% if post.description %}
          {{ post.description }}
          <div class="post-more-link text-center">
            <a class="btn" href="{{ url_for(post.path) }}">
              {{ __('post.read_more') }} &raquo;
            </a>
          </div>
        {% elif post.excerpt  %}
          {{ post.excerpt }}
          <div class="post-more-link text-center">
            <a class="btn" href="{{ url_for(post.path) }}{% if theme.scroll_to_more %}#more{% endif %}" rel="contents">
              {{ __('post.read_more') }} &raquo;
            </a>
          </div>
        {% elif theme.auto_excerpt.enable %}
          {% set content = post.content | striptags %}
          {{ content.substring(0, theme.auto_excerpt.length) }}
          {% if content.length > theme.auto_excerpt.length %}...{% endif %}

          <div class="post-more-link text-center">
            <a class="btn" href="{{ url_for(post.path) }}{% if theme.scroll_to_more %}#more{% endif %}" rel="contents">
              {{ __('post.read_more') }} &raquo;
            </a>
          </div>
        {% else %}
          {% if post.type === 'picture' %}
            <a href="{{ url_for(post.path) }}">{{ post.content }}</a>
          {% else %}
            {{ post.content }}
          {% endif %}
        {% endif %}
      {% else %}
        {{ post.content }}
      {% endif  %}
    </div>

    <footer class="post-footer">
      {% if post.tags and post.tags.length and not is_index %}
        <div class="post-tags">
          {% for tag in post.tags %}
            <a href="{{ url_for(tag.path) }}" rel="tag">#{{ tag.name }}</a>
          {% endfor %}
        </div>
      {% endif %}

      {% set isLast = loop.index % page.per_page === 0 %}
      {% if is_index and not isLast %}
        <div class="post-eof"></div>
      {% endif %}
    </footer>
  </article>

{% endmacro %}
