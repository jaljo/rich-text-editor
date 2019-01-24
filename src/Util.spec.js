import Cookies from 'universal-cookie'
import {
  prop
} from 'ramda'
import * as Util from './Util'

describe('Util', () => {
  it('can create easy reducer', () => {
    const reducer      = Util.createReducer(false, {
      ['ON']:  () => true,
      ['OFF']: () => false,
    });
    const initialState = reducer();
    const on           = { type: 'ON' };
    const off          = { type: 'OFF' };
    const stateOn      = reducer(initialState, on);
    const stateOff     = reducer(stateOn, off);

    expect(initialState).toBe(false);
    expect(stateOff).toBe(false);
    expect(stateOn).toBe(true);
  });

  it('can immutably add an hour to a date', () => {
    const originalDate = new Date('2018-11-28T01:00:00.000Z');
    const newDate = Util.addHour(1)(originalDate);

    expect(originalDate.toISOString()).toEqual('2018-11-28T01:00:00.000Z');
    expect(newDate.toISOString()).toEqual('2018-11-28T02:00:00.000Z');
  })

  it('can immutably set an hour to a date according to local timezone', () => {
    const originalDate = new Date('2018-11-28T00:00:00.000Z');
    const originalISOString = originalDate.toISOString();
    const originalMs = originalDate.getTime();
    // as the tests can be ran on any machine (and so on any TZ), we have
    // to consider this TZ for the expected output as the `setHour` method
    // depends on the TZ we're in.
    const machineOffset = (new Date()).getTimezoneOffset();

    const hourToSet = 3;
    const newDate = Util.setHour(hourToSet)(originalDate);

    const expectedNewDateMs = originalMs + (hourToSet * 60 * 60 * 1000) + (machineOffset * 60 * 1000);

    expect(originalDate.toISOString()).toEqual(originalISOString);
    expect(newDate.getTime()).toEqual(expectedNewDateMs);
  })

  it('can immutably set a minute to a date', () => {
    const originalDate = new Date('2018-11-28T00:00:00.000Z');
    const newDate = Util.setMinute(1)(originalDate);

    expect(originalDate.toISOString()).toEqual('2018-11-28T00:00:00.000Z');
    expect(newDate.toISOString()).toEqual('2018-11-28T00:01:00.000Z');
  })

  it('can compute the hour diff between two dates', () => {
    const startDate = new Date('2018-11-28T01:00:00.000Z');
    const endDate = new Date('2018-11-28T03:00:00.000Z');

    expect(Util.diffAsHours(startDate, endDate)).toBe(2);
  })

  it('can format a date', () => {
    const formattedDate = Util.formatDate('2018-11-28T01:00:00.000Z');

    expect(formattedDate.match(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/).length).toBe(1)
  })

  it('can format a time', () => {
    const formattedTime = Util.formatTime('2018-11-28T10:00:00.000Z');

    expect(formattedTime.match(/[0-9]{2}:[0-9]{2}/).length).toBe(1);
  })

  it('can format a dateTime', () => {
    const formattedDateTime = Util.formatDateTime('2018-11-28T10:00:00.000Z');

    expect(formattedDateTime.match(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}, [0-9]{2}:[0-9]{2}/).length).toBe(1);
  })

  it('can replace a query key by a search key', () => {
    const queriedLocation = {
      href: 'http://test.com',
      query: '?foo=bar'
    };
    const location        = Util.replaceKeyQueryBySearch(queriedLocation);

    expect(location).toEqual({
      href: 'http://test.com',
      search: '?foo=bar',
    })
  });

  it('transforms an url to a location', () => {
    const url      = 'http://test.com/resource?foo=bar#anchor';
    const location = Util.urlToLocation(url);

    expect(location.href).toBe(url);
    expect(location.hash).toBe('#anchor');
    expect(location.host).toBe('test.com');
    expect(location.hostname).toBe('test.com');
    expect(location.origin).toBe('http://test.com');
    expect(location.port).toBe('');
    expect(location.protocol).toBe('http:');
    expect(location.search).toBe('?foo=bar');
  });

  it('can match a route', () => {
    const pattern = '/foo/:id';

    expect(Util.routeMatch('/test', { pattern: '/foo/:id' })).toBe(false);
    expect(Util.routeMatch('/foo/123', { pattern: '/foo/:id' })).toBe(true);
  });

  it('can return the route parameters', () => {
    let route = { pattern: '/foo/:id' };
    let complexRoute = { pattern: '/hello/:gender/:name/:age' };

    expect(Util.routeParameters('/test', route)).toEqual({});
    expect(Util.routeParameters('/foo/10', route)).toEqual({
      id: '10',
    });
    expect(Util.routeParameters('/hello/female/Jane Doe/19', complexRoute))
      .toEqual({
        gender: 'female',
        name: 'Jane Doe',
        age: '19',
      });
  });

  it('can determine if a route matches a name', () => {
    const matches = [{ name: 'articles-create' }];

    expect(
      Util.hasRouteName(['articles-create', 'articles-edit'])(matches)
    ).toEqual(true);
  });

  it('can parse a query string', () => {
    const query   = '?foo=bar&test=false&a[]=test&a[]=test2';
    const filters = Util.parseQueryString(query);

    expect(Util.parseQueryString(query)).toEqual({
      foo: 'bar',
      test: false,
      a: ['test', 'test2'],
    });
  });

  it('can force https image load for preproduction env', () => {
    expect(Util.getImagePath(
      'http://api.preprod.i24news.org/uploads/test.jpeg'
    )).toEqual(
      'https://api.preprod.i24news.org/uploads/test.jpeg'
    )
  });

  it('can returns original image path by default', () => {
    expect(Util.getImagePath(
      'http://cdn.i24news.tv/upload/image/ap-obama-correspondents-4_3_r536_c534.jpg'
    )).toEqual(
      'http://cdn.i24news.tv/upload/image/ap-obama-correspondents-4_3_r536_c534.jpg'
    )
  });

  const buildHeadersMock = headers => ({
    get: key => prop(key)(headers),
  })

  const buildResponseMock = (status, body, headers) => ({
    status,
    json: () => new Promise(resolve => resolve(body)),
    headers: buildHeadersMock(Object.assign(
      {
        'Content-Type': 'application/json',
      },
      headers,
    )),
  })

  it('can fetch a resource on the backend API', () => {
    let actualResource, actualOptions;

    const fetcher = (resource, options) => new Promise(resolve => {
      actualResource = resource
      actualOptions = options

      return resolve(buildResponseMock(200, { foo: 'bar' }))
    })

    const cookies = new Cookies()
    cookies.set('adminToken', 'abcd1234')

    return Util.fetchApi(fetcher, cookies)('/test')
      .then(response => {
        expect(actualResource).toBe(`${process.env.REACT_APP_API_BASE_URL}/test`)
        expect(actualOptions).toEqual({
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer abcd1234',
            'Content-Type': 'application/json',
          },
        })
        expect(response.status).toBe(200)
        expect(response.body.foo).toBe('bar')
      })
      .catch(() => expect('Has happened').toBe('Should not happen'))
  })

  it('can reject a fetch promise in case of >= 400 HTTP code', () => {
    const fetcher = () =>
      new Promise(resolve =>
        resolve(buildResponseMock(400, { error: 'bad request' }))
      )

    return Util.fetchApi(fetcher, new Cookies())('/test')
      .then(() => expect('Has happened').toBe('Should not happen'))
      .catch(msg => {
        expect(msg.error).toBe('bad request')
      })
  })

  it('can reset fetchApi Content-Type header', () => {
    let actualOptions

    const fetcher = (resource, options) => {
      actualOptions = options

      return new Promise(resolve =>
        resolve(buildResponseMock(200, { foo: 'bar' }))
      )
    }

    const cookies = new Cookies()
    cookies.set('adminToken', 'abcd1234')

    return Util.fetchApi(fetcher, cookies)('/test', { resetContentType: true })
      .then(() => {
        expect(actualOptions.headers).toEqual({
          'Accept': 'application/json',
          'Authorization': 'Bearer abcd1234',
        })
      })
      .catch(() => expect('Has happened').toBe('Should not happen'))
  })

  it('can set fetchApi Accept header', () => {
    let actualOptions

    const fetcher = (resource, options) => {
      actualOptions = options

      return new Promise(resolve =>
        resolve(buildResponseMock(200, { foo: 'bar' }))
      )
    }

    const cookies = new Cookies()
    cookies.set('adminToken', 'abcd1234')

    return Util.fetchApi(fetcher, cookies)('/test', { headers: { 'Accept': 'text/plain' } })
      .then(() => {
        expect(actualOptions.headers).toEqual({
          'Accept': 'text/plain',
          'Authorization': 'Bearer abcd1234',
          'Content-Type': 'application/json',
        })
      })
      .catch(() => expect('Has happened').toBe('Should not happen'))
  })

  const mockFormError = {
  	"type": "about:blank",
  	"field": "topic",
  	"errors": ['Top level error.'],
  	"children": [{
  		"type": "about:blank",
  		"field": "type",
  		"errors": [],
  		"children": []
  	 }, {
  		"type": "about:blank",
  		"field": "title",
  		"errors": ["This value should not be blank.", "This value should not be null."],
  		"children": []
  	}],
  };

  it('format errors : form', () => {
    expect(Util.formatErrors(mockFormError)).toEqual([
      'Top level error.',
      'title: This value should not be blank. This value should not be null.'
    ]);
  });

  it('format errors : simple alert', () => {
    expect(Util.formatErrors('alert')).toEqual([
      'alert',
    ]);
  });

  it('format errors : message', () => {
    expect(Util.formatErrors({ message: 'alert' })).toEqual([
      'alert',
    ]);
  });

  it('returns an empty string when the given text is null', () => {
    expect(Util.ellipsis(255)(null)).toEqual('');
  })

  it('returns an ellipsis when the specified length is too short', () => {
    const text = 'lorem ipsum dolor';

    expect(Util.ellipsis(0)(text)).toEqual('…');
    expect(Util.ellipsis(1)(text)).toEqual('…');
    expect(Util.ellipsis(2)(text)).toEqual('…');
    expect(Util.ellipsis(3)(text)).toEqual('…');
    expect(Util.ellipsis(4)(text)).toEqual('…');
    expect(Util.ellipsis(5)(text)).toEqual('…');
    expect(Util.ellipsis(6)(text)).toEqual('…');
    expect(Util.ellipsis(7)(text)).toEqual('lorem …');
  })

  it('returns the original text when the specified ellipsis length is too high', () => {
    const text = 'lorem ipsum dolor';

    expect(Util.ellipsis(text.length)(text)).toEqual(text);
    expect(Util.ellipsis(20)(text)).toEqual(text);
  })

  it('truncates a text at word and applies an ellipsis to it when the char count exceed the length', () => {
    const text = 'lorem ipsum dolor';

    expect(Util.ellipsis(8)(text)).toEqual('lorem …');
    expect(Util.ellipsis(13)(text)).toEqual('lorem ipsum …');
  })

  it('always return a list', () => {
    expect(Util.nilToList(null)).toEqual([]);
    expect(Util.nilToList([1, 2, 3])).toEqual([1, 2, 3]);
  });

  const indexedListMock = [
    {id: 1, name: 'Angela'},
    {id: 2, name: 'François'},
    {id: 3, name: 'Nicolas'},
    {id: 4, name: 'Vladimir'},
  ]

  it('can find an object identified by an id in a list', () => {
    expect(Util.findById(3, indexedListMock)).toEqual(
      {id: 3, name: 'Nicolas'},
    )
  });

  it('can remove an object from an indexed list', () => {
    expect(Util.removeFrom(3, indexedListMock)).toEqual([
      {id: 1, name: 'Angela'},
      {id: 2, name: 'François'},
      {id: 4, name: 'Vladimir'},
    ]);
  });

  it('can find the position of an element in an indexed list', () => {
    expect(Util.indexOrLast(3, indexedListMock)).toEqual(2);
    expect(Util.indexOrLast(null, indexedListMock)).toEqual(4);
  });

  it('can update an element in an indexed list', () => {
    expect(Util.updateIn(3, 'a', indexedListMock)).toEqual([
      {id: 1, name: 'Angela'},
      {id: 2, name: 'François'},
      'a',
      {id: 4, name: 'Vladimir'},
    ]);
  });

  it('can slugify a string', () => {
    expect(Util.slugify('Angela Merkel.')).toEqual('angela-merkel-')
  });

  it('can get opposite sort direction', () => {
    expect(Util.getOppositeSortDirection('asc')).toEqual('desc');
    expect(Util.getOppositeSortDirection('desc')).toEqual('asc');
  })

  it('can get a sort query string', () => {
    expect(Util.getSortQueryString({ publishedAt: 'desc'})).toEqual('-publishedAt');
    expect(Util.getSortQueryString({ email: 'asc'})).toEqual('email');
  })

  it('identifies a row target', () => {
    expect(Util.isTarget(true, 25, 25)).toEqual(true);
    expect(Util.isTarget(false, 25, 25)).toEqual(false);
    expect(Util.isTarget(true, 25, 24)).toEqual(false);
  });

  it('refresh pagination', () => {
    expect(
      Util.refreshPagination(1543, 10, 20),
    ).toEqual({
      first: 1,
      current: 20,
      last: 155,
    });
  });

  const defaultDictionary = {
    french: {
      hello: 'Bonjour {name}',
      foo: {
        bar: 'Deep test {var}'
      }
    },
    english: {
      hello: 'Hello {name}',
    },
    ar: {
      hello: 'Yo {name}',
    },
  }

  it('translate a given key referenced in a dictionary', () => {
    const translations = Util.translate(defaultDictionary)

    const fr = translations('fr')
    const en = translations('en')
    const ar = translations('ar')

    expect(fr('hello', {'name': 'John Doe'}))
      .toBe('Bonjour John Doe')

    expect(en('hello', {'name': 'Jane Doe'}))
      .toBe('Hello Jane Doe')

    expect(ar('hello', {'name': 'Peter Doe'}))
      .toBe('Yo Peter Doe')
  });

  it('translate text deeply', () => {
    expect(
      Util.translate(defaultDictionary)('fr')('foo.bar', {var: 'test'})
    ).toBe('Deep test test')
  });

  it('concatenate the rtl class with other classes for arabic locale', () => {
    expect(
      Util.rtlClass('ar')('class-a class-b')
    ).toBe('class-a class-b rtl')

    expect(
      Util.rtlClass('fr')('class-a class-b')
    ).toBe('class-a class-b ')

    expect(
      Util.rtlClass('en')('class-a class-b')
    ).toBe('class-a class-b ')
  });

  it('get the text content from an html string', () => {
    expect(
      Util.getTextFromHTML('<p>This is an excerpt.</p>')
    ).toBe('This is an excerpt.');
  });
});
